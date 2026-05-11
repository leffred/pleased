# Journal de Bord - pleased.fr

## Objectif du Projet
Créer la plateforme "pleased.fr", un service de cadeaux personnels et d'entreprise inspiré de ongoody.com. 
Le concept principal : envoyer un cadeau via un simple lien (email/SMS), sans connaître l'adresse physique du destinataire.

## État Actuel
- **Initialisation** : Le projet Next.js (App Router) a été initialisé à la racine du dossier `because` avec succès.
- **Frontend** : Les pages principales du MVP ont été créées :
  - Landing Page (`/`) avec la proposition de valeur.
  - Catalogue des cadeaux (`/gifts`).
  - Page détail produit (`/gifts/[id]`).
  - Tunnel de paiement (`/checkout`).
  - Page de réception (Unwrapping) et saisie d'adresse (`/receive/[magic_link]`).
- **Design** : Configuration de TailwindCSS v4 avec une palette de couleurs premium (budget 50-100€) et des animations (`tailwindcss-animate`).
- **Git** : Dépôt lié à `https://github.com/leffred/pleased` et premier commit poussé sur la branche `main`.
- **Backend** : Le client Supabase a été initialisé (`src/lib/supabase.ts`), prêt à recevoir les vraies variables d'environnement.

## Bugs / Problèmes
- Aucun. Les données du catalogue sont actuellement mockées pour le MVP.

## Prochaines Étapes
1. **Intégration Supabase (Chef de Produit)** : Créer l'instance Supabase et renseigner les URL et clés dans Vercel / `.env.local`.
2. **Paiement (V2)** : Brancher le checkout au webhook n8n/Make pour générer les liens de paiement Stripe et traiter les commandes réelles.
3. **Déploiement** : Pousser sur Vercel.
