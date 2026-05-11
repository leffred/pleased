# Journal de Bord - pleased.fr

## Objectif du Projet
Créer la plateforme "pleased.fr", un service de cadeaux personnels et d'entreprise inspiré de ongoody.com. 
Le concept principal : envoyer un cadeau via un simple lien (email/SMS), sans connaître l'adresse physique du destinataire.

## État Actuel (Paiement Stripe & Automatisations n8n Intégrés)
- **Base de Données Supabase** : Tables `profiles`, `products`, `gifts`, `pools` et `pool_contributions` opérationnelles.
- **Tunnel de Paiement & Stripe** : 
  - Achat individuel (`/checkout`) fonctionnel avec Stripe Checkout.
  - Participation aux cagnottes (`/group-gift/[id]`) fonctionnelle avec montants libres envoyés vers Stripe.
  - L'ID du cadeau ou de la cagnotte est systématiquement passé dans les métadonnées Stripe (`client_reference_id`, `metadata`).
- **Automatisations n8n** : Workflow configuré et connecté aux Webhooks Stripe pour mettre à jour Supabase et envoyer les emails de confirmation/liens magiques.

## Bugs / Problèmes
- Aucun. L'application est prête pour la production.

## Prochaines Étapes
1. **Déploiement Vercel** : 
   - Connecter le repository Github à Vercel.
   - Ajouter toutes les variables d'environnement (Supabase & Stripe) dans les réglages de Vercel.
   - Lier le nom de domaine définitif (`pleased.fr`).
