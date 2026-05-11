# Journal de Bord - pleased.fr

## Objectif du Projet
Créer la plateforme "pleased.fr", un service de cadeaux personnels et d'entreprise inspiré de ongoody.com. 
Le concept principal : envoyer un cadeau via un simple lien (email/SMS), sans connaître l'adresse physique du destinataire.

## État Actuel (Phase 7 - Assistant IA et Filtrage Interactif)
- **Base de Données Supabase** : Tables `profiles`, `products`, `gifts`, `pools` et `pool_contributions` opérationnelles. **723 produits** premium variés (Tech, Bien-être, Maison, Food, Expérience) générés et ajoutés en base, avec des prix allant de 10 € à 900 €.
- **Catalogue & Assistant IA** : Filtres par catégories intégrés. Un module d'Assistant IA interroge une Edge Function Supabase (`ai-gift-assistant`) pour suggérer des cadeaux via LLM (OpenRouter) tout en gérant l'échelle (filtrage SQL natif avant sollicitation du LLM).
- **Tableau de bord** : Historique et Paramètres ajoutés avec l'état actif dans le menu latéral.
- **Pages Publiques** : Pages "Comment ça marche" et "FAQ" avec design soigné et nouveau composant Footer.
- **Tunnel de Paiement & Stripe** : Achat individuel et participations aux cagnottes fonctionnels avec Stripe Checkout.
- **Automatisations n8n** : Workflow configuré et connecté aux Webhooks Stripe pour mettre à jour Supabase et envoyer les emails de confirmation/liens magiques.

## Bugs / Problèmes
- Aucun. Les pages 404 du dashboard et du catalogue ont été corrigées.

## Prochaines Étapes
1. **Déploiement Vercel** : 
   - Connecter le repository Github à Vercel.
   - Ajouter toutes les variables d'environnement (Supabase & Stripe) dans les réglages de Vercel.
   - Lier le nom de domaine définitif (`pleased.fr`).
