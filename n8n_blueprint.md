# Guide de Configuration n8n / Make 🤖

Ce document explique comment configurer votre scénario d'automatisation pour réceptionner les paiements Stripe et mettre à jour Pleased.fr.

## Principe Général
L'application Next.js ne gère **pas** la validation des paiements.
Quand un utilisateur paye sur Stripe, Stripe envoie un événement (Webhook) `checkout.session.completed` à votre outil d'automatisation (n8n ou Make).
Votre automatisation doit ensuite :
1. Lire l'ID du cadeau (ou de la cagnotte) dans les métadonnées de Stripe.
2. Faire une requête API vers Supabase pour valider la commande.
3. Envoyer un email/SMS avec le lien magique ou de confirmation.

---

## 1. Configurer le Webhook Stripe
1. Dans n8n, créez un trigger **Webhook**. Copiez l'URL de test fournie par n8n.
2. Dans le Dashboard Stripe, allez dans *Développeurs > Webhooks* et ajoutez un endpoint.
3. Collez l'URL de n8n et sélectionnez l'événement `checkout.session.completed`.

---

## 2. Structure des données envoyées par Stripe
Lorsque Stripe appelle votre Webhook, le corps JSON ressemble à ceci :
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "amount_total": 6850,
      "client_reference_id": "8b3f1234-abcd-...",
      "metadata": {
        "giftId": "8b3f1234-abcd-...", 
        "poolId": "...", // Présent seulement si c'est une cagnotte
        "participantName": "...", // Présent seulement si cagnotte
        "participantMessage": "...", // Présent seulement si cagnotte
        "workspaceId": "...", // Présent si rechargement de portefeuille B2B
        "type": "workspace_topup" // Présent si rechargement
      }
    }
  }
}
```

---

## 3. Mise à jour Supabase (Requête HTTP / Supabase Node)
Dans n8n, utilisez le **nœud HTTP Request** ou le **nœud Supabase** pour interagir avec votre base de données. 
Utilisez votre clé d'API secrète Supabase (`service_role` key) pour contourner les règles RLS.

### Cas A : C'est un cadeau simple (giftId est présent)
*Action : Mettre le statut à "paid" et générer un magic link.*
- **URL** : `PATCH https://emxdmybwbfxpoovppxlq.supabase.co/rest/v1/gifts?id=eq.{{$json.data.object.metadata.giftId}}`
- **Headers** : 
  - `apikey`: `VOTRE_SERVICE_ROLE_KEY`
  - `Authorization`: `Bearer VOTRE_SERVICE_ROLE_KEY`
  - `Content-Type`: `application/json`
- **Body** :
```json
{
  "status": "paid",
  "magic_link_token": "généré_par_n8n_ou_uuid"
}
```

### Cas B : C'est une participation à une Cagnotte (poolId est présent)
*Action : Insérer la participation dans pool_contributions.*
- **URL** : `POST https://emxdmybwbfxpoovppxlq.supabase.co/rest/v1/pool_contributions`
- **Body** :
```json
{
  "pool_id": "{{$json.data.object.metadata.poolId}}",
  "participant_name": "{{$json.data.object.metadata.participantName}}",
  "amount": {{$json.data.object.amount_total / 100}},
  "message": "{{$json.data.object.metadata.participantMessage}}"
}
```

### Cas C : Rechargement d'un Workspace B2B (type === 'workspace_topup')
*Action : Ajouter les fonds au wallet du Workspace et insérer la transaction.*
- **Action 1 (Supabase - Fetch)** : Récupérez le workspace existant via `id = {{$json.data.object.metadata.workspaceId}}` pour connaître son solde actuel (`balance`).
- **Action 2 (Supabase - Update)** : Mettre à jour le workspace avec le nouveau solde : `balance = balance_actuelle + {{$json.data.object.amount_total}}`.
- **Action 3 (Supabase - Insert)** : Créer une ligne dans `transactions` avec `workspace_id = {{$json.data.object.metadata.workspaceId}}`, `amount = {{$json.data.object.amount_total}}`, et `type = 'deposit'`.

---

## 4. Automatisations RH (B2B Mass Gifting & Anniversaires)

Pour envoyer un cadeau de façon automatisée via n8n (ex: le jour de l'anniversaire d'un collaborateur), votre scénario n8n n'a pas besoin de passer par Stripe. Il peut utiliser directement le solde du portefeuille d'entreprise (Workspace).

### Cas D : Cadeau d'Anniversaire ou d'Onboarding
*Action : Faire un appel à l'API interne pour créer le cadeau et déduire automatiquement le solde du Wallet.*

**Pré-requis dans n8n :**
- Un nœud qui lit une base de données RH (ex: Google Sheets, Notion, PayFit) tous les jours à 8h00.
- Un nœud "If" qui filtre les collaborateurs dont la date d'anniversaire est aujourd'hui.

**Configuration de la Requête HTTP (Appel API Interne) :**
- **Method** : `POST`
- **URL** : `https://pleased.fr/api/b2b/send-gift`
- **Headers** : 
  - `Authorization`: `Bearer VOTRE_SERVICE_ROLE_KEY`
  - `Content-Type`: `application/json`
- **Body** :
```json
{
  "workspace_id": "L'ID_DE_VOTRE_WORKSPACE_ENTREPRISE",
  "product_id": "L'ID_DU_PRODUIT_CADEAU_PAR_DEFAUT",
  "recipient_name": "{{ $json.Prenom_Collaborateur }}",
  "recipient_email": "{{ $json.Email_Collaborateur }}",
  "message": "Joyeux anniversaire de la part de toute l'équipe !"
}
```

> **Avantage** : Cette route API sécurisée s'occupe de vérifier le solde, de le déduire, d'enregistrer la transaction et de générer le cadeau dans Supabase de façon atomique.

---

## 5. Envoi de l'Email / SMS
Maintenant que le cadeau est payé et mis à jour, utilisez le nœud Gmail / SendGrid / Twilio dans n8n pour avertir l'expéditeur.

**Lien Magique à envoyer :**
`https://pleased.fr/swap/{{magic_link_token}}`

---

## 🚀 Alternative Rapide : Prompt pour l'Agent IA de n8n

Si vous utilisez la fonctionnalité de génération par IA intégrée à n8n, copiez-collez simplement ce prompt pour générer le workflow complet automatiquement :

> "Je veux créer un workflow qui écoute un Webhook Stripe et met à jour une base de données Supabase via des requêtes HTTP.
> 
> 1. Commence par un noeud Webhook (méthode POST, path test-stripe).
> 2. Ajoute un noeud Switch (ou If) pour vérifier le type d'événement : `{{ $json.body.type }}` doit être égal à `checkout.session.completed`.
> 3. Ajoute un autre noeud Switch (ou If) pour séparer deux cas basés sur les métadonnées :
>    - Cas 1 (Cadeau Simple) : Si `{{ $json.body.data.object.metadata.giftId }}` existe.
>    - Cas 2 (Cagnotte) : Si `{{ $json.body.data.object.metadata.poolId }}` existe.
> 4. Pour le Cas 1 (Cadeau Simple) :
>    - Ajoute un noeud 'Crypto' ou exécute un bout de code JS pour générer un UUID aléatoire qui servira de token (sauvegarde-le dans `magic_link_token`).
>    - Ajoute un noeud HTTP Request configuré en méthode PATCH. L'URL est `https://emxdmybwbfxpoovppxlq.supabase.co/rest/v1/gifts?id=eq.{{ $json.body.data.object.metadata.giftId }}`. Dans les Headers, ajoute `apikey` et `Authorization` (avec le mot Bearer devant) en utilisant ma clé secrète Supabase. Dans le Body (JSON), envoie `{"status": "paid", "magic_link_token": "{{ $json.magic_link_token }}"}`.
>    - Ajoute ensuite un noeud Gmail/Email pour envoyer le lien `https://pleased.fr/swap/{{ $json.magic_link_token }}`.
> 5. Pour le Cas 2 (Cagnotte) :
>    - Ajoute un noeud HTTP Request configuré en méthode POST. L'URL est `https://emxdmybwbfxpoovppxlq.supabase.co/rest/v1/pool_contributions`. Dans les Headers, ajoute `apikey` et `Authorization`. Dans le Body (JSON), envoie les valeurs suivantes : `"pool_id": "{{ $json.body.data.object.metadata.poolId }}"`, `"participant_name": "{{ $json.body.data.object.metadata.participantName }}"`, `"amount": {{ $json.body.data.object.amount_total / 100 }}`, et `"message": "{{ $json.body.data.object.metadata.participantMessage }}"`.
>
> Relie tout logiquement et utilise les expressions dynamiques correctement."

---

## 5. Assistant IA (Recommandation de Cadeaux)

Nous avons mis en place un module d'Assistant IA dans le catalogue (`/gifts`). Ce module envoie à n8n le profil du destinataire **et l'intégralité du catalogue**. n8n doit demander à OpenRouter (LLM) de sélectionner les 3 meilleurs produits.

### A. Création du Webhook n8n
1. Créez un nouveau workflow n8n.
2. Ajoutez un **Webhook Node** :
   - Method : `POST`
   - Path : `ai-gift-assistant`
   - Respond : `Using Respond to Webhook Node` (Très important, car l'API Next.js attend une réponse).
3. Copiez l'URL de test/production et ajoutez-la dans votre fichier `.env.local` sous le nom : `N8N_AI_WEBHOOK_URL=votre_url`.

### B. Ajout du noeud OpenRouter (Advanced LLM)
1. Reliez le Webhook à un noeud **OpenRouter** (ou OpenAI/Anthropic selon ce que vous utilisez sur n8n).
2. Fournissez le modèle souhaité (ex: `anthropic/claude-3-haiku` ou `gpt-4o-mini` - pas besoin d'un modèle très cher, la tâche est simple).
3. **Prompt Système à utiliser :**
```text
Tu es un personal shopper expert en cadeaux de luxe.
Voici le catalogue de produits disponible : 
{{ $json.body.catalog }}

Voici le profil du destinataire :
- Âge : {{ $json.body.profile.age }}
- Genre : {{ $json.body.profile.gender }}
- Centres d'intérêt : {{ $json.body.profile.interests }}
- Budget max : {{ $json.body.profile.budget }} €

Analyse le profil et sélectionne EXACTEMENT les 3 meilleurs cadeaux du catalogue.
Tu dois UNIQUEMENT renvoyer un JSON valide avec cette structure stricte :
{
  "productIds": ["id_1", "id_2", "id_3"]
}
Aucun autre texte, juste le JSON.
```

### C. Réponse au Webhook
1. Ajoutez un noeud **Respond to Webhook**.
2. Connectez la sortie du LLM à ce noeud. Assurez-vous que le noeud renvoie bien le JSON produit par le LLM.
3. Sauvegardez et activez le workflow.
