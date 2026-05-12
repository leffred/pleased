# Journal de Bord - pleased.fr

## Objectif du Projet
Créer la plateforme "pleased.fr", un service de cadeaux personnels et d'entreprise inspiré de ongoody.com. 
Le concept principal : envoyer un cadeau via un simple lien (email/SMS), sans connaître l'adresse physique du destinataire.

## État Actuel (Phase 8 - B2B & Workspaces)
### 1. État du Projet
*   **Architecture :** Next.js 15 (App Router), Tailwind CSS, Supabase (PostgreSQL), Stripe.
*   **Contenu :** La base de données contient **723 produits** premium.
*   **Statut :** Application déployée et fonctionnelle sur Vercel.

### 2. Fonctionnalités Implémentées (Session actuelle)
- **Espaces Entreprises (B2B)** : Création d'une infrastructure "Workspace" avec `workspaces`, `workspace_members`, et `transactions`.
- **Top-Up Wallet** : Action Stripe Checkout pour recharger un compte entreprise et documenter le webhook côté n8n.
- **Paiement B2B** : Modification de la page Checkout pour permettre le paiement d'un cadeau en prélevant directement le solde de l'entreprise si le budget est suffisant.
- **Digital Unwrapping** : Ajout d'animations `framer-motion` et `canvas-confetti` pour la réception des cadeaux.

### 3. Nouvelles Fonctionnalités B2B (Campagnes et API RH)
- **Campagnes en Masse (Mass Gifting)** : Création d'un module d'upload de fichier CSV (`/dashboard/workspaces/[id]/campaigns`) permettant d'envoyer des cadeaux à des dizaines de destinataires simultanément en prélevant le coût total sur le solde du compte entreprise (Wallet).
- **API Automatisations RH** : Création d'une route API sécurisée (`/api/b2b/send-gift`) permettant de générer automatiquement un cadeau depuis n8n (ex: anniversaires, onboarding) et de déduire automatiquement le budget alloué.
- **Documentation n8n** : Mise à jour du fichier `n8n_blueprint.md` avec le Cas D pour configurer les workflows d'anniversaires ou d'onboarding.

## Bugs / Problèmes
- Aucun. Les builds TypeScript passent avec succès.

## Prochaines Étapes Logiques
- Ajouter un filtre de catégories sur le Dashboard B2B pour segmenter les envois.
- Gérer l'export CSV des transactions pour la comptabilité.
- Configurer les domaines sur Vercel et passer le projet en production pour un premier test Bêta.
