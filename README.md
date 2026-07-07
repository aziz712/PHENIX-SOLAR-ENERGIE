# ☀️ PHOENIX SOLAR ENERGY - Plateforme Web

Bienvenue sur le dépôt officiel du site web et de la plateforme de gestion de **PHOENIX SOLAR ENERGY**, leader de l'installation photovoltaïque en Tunisie.

Cette application est une solution complète (Site Vitrine + Tableau de Bord Admin + Espace Client) développée avec les technologies web les plus modernes pour garantir performance, SEO, et expérience utilisateur fluide.

## 🚀 Aperçu du Projet

L'application sert trois objectifs principaux :
1.  **Conversion Client** : Un site vitrine hautement performant pour présenter les services et capter des leads (demandes de devis).
2.  **Gestion Interne (Admin)** : Un tableau de bord complet pour gérer les demandes, la maintenance, les projets réalisés et les messages.
3.  **Suivi Client** : Un espace dédié permettant aux clients de suivre l'avancement de leur installation et de demander une maintenance.

## ✨ Fonctionnalités Principales

### 🌐 Interface Publique (Site Vitrine)
*   **Design Premium & Animé** : Utilisation de `Framer Motion` pour des animations fluides (Scroll reveal, Stats animées, Hover effects).
*   **100% SEO Friendly** : Architecture optimisée pour Google (SSR, Meta Tags dynamiques, Schéma JSON-LD, Sitemap XML, Robots.txt).
*   **PWA (Progressive Web App)** : Installable sur mobile comme une application native, fonctionne hors-ligne.
*   **Interactivité** :
    *   Formulaire de demande de devis multi-étapes.
    *   FAQ Accordion interactive.
    *   Section "Réalisations" dynamique.
*   **Performance** : Optimisation des images, chargement différé (Lazy Loading), et temps de réponse rapide grâce à Next.js.

### 🔐 Authentification & Sécurité
*   **Système de Connexion Sécurisé** : JWT (JSON Web Tokens) stockés dans des cookies HTTP-only.
*   **Hachage de Mot de Passe** : Utilisation de `bcryptjs` pour sécuriser les données utilisateurs.
*   **Réinitialisation de Mot de Passe** : Flux complet avec envoi de code/lien par email via `Nodemailer`.
*   **Protection des Routes** : Middleware Next.js pour protéger les pages Admin et Client.

### 🛠️ Tableau de Bord Administrateur
*   **Gestion des Demandes (Leads)** :
    *   Visualisation des nouvelles demandes d'installation.
    *   Mise à jour des statuts (Nouveau, En cours, Validé, Rejeté).
    *   Filtrage avancé (Par date, recherche textuelle, statut).
*   **Gestion de la Maintenance** : Suivi des tickets de maintenance ouverts par les clients.
*   **CMS Réalisations** : Ajout, modification et suppression des projets affichés sur le site.
*   **Messagerie** : Boîte de réception intégrée pour les messages du formulaire de contact.
*   **Temps Réel** : Mise à jour automatique des données (Polling) sans rechargement de page.

### 👤 Espace Client
*   **Suivi de Projet** : Timeline visuelle de l'avancement de l'installation solaire.
*   **Demande de Maintenance** : Formulaire simplifié pour signaler un problème technique.
*   **Documents** : Accès aux devis et factures (prévu).

## 💻 Stack Technique (MERN + Next.js)

*   **Frontend & Framework** : [Next.js 15](https://nextjs.org/) (App Router), [React](https://react.dev/)
*   **Langage** : [TypeScript](https://www.typescriptlang.org/) (Typage strict pour la robustesse)
*   **Base de Données** : [MongoDB](https://www.mongodb.com/) (Atlas) + [Mongoose](https://mongoosejs.com/) (ODM)
*   **Styling** : [Tailwind CSS](https://tailwindcss.com/) (Design System)
*   **Animations** : [Framer Motion](https://www.framer.com/motion/)
*   **Icônes** : [Lucide React](https://lucide.dev/)
*   **Emails** : [Nodemailer](https://nodemailer.com/)
*   **PWA** : `next-pwa`

## 📂 Structure du Projet

```bash
phenix-solar-energie/
├── app/                  # Pages et Routes (App Router)
│   ├── admin/            # Dashboard Administrateur
│   ├── api/              # API Routes (Backend Serverless)
│   ├── client/           # Dashboard Client
│   ├── (public)/         # Pages publiques (Home, About, Services...)
│   └── layout.tsx        # Layout racine (PWA tags, Fonts, Metadata)
├── components/           # Composants Réutilisables (Navbar, Footer, UI...)
├── lib/                  # Utilitaires (Connexion DB, Auth, Helpers)
├── models/               # Schémas Mongoose (User, Request, Message...)
├── public/               # Assets statiques (Images, Icons, Manifest)
└── ...config files       # Configurations (Tailwind, TypeScript, Next)
```

## 🔧 Installation et Lancement

1.  **Cloner le dépôt**
    ```bash
    git clone https://github.com/aziz712/SunWatt-tech.git
    cd phenix-solar-energie
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    # En cas de conflit de version (Legacy peer deps)
    npm install --legacy-peer-deps
    ```

3.  **Configurer les variables d'environnement**
    Créer un fichier `.env.local` à la racine :
    ```env
    MONGODB_URI=votre_url_mongodb_atlas
    JWT_SECRET=votre_cle_secrete_complexe
    EMAIL_USER=votre_email@gmail.com
    EMAIL_PASS=votre_mot_de_passe_application_gmail
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

5.  **Build pour Production**
    ```bash
    npm run build
    npm start
    ```

## 📱 PWA (Progressive Web App)

L'application est configurée pour être installable.
*   **Manifest** : `public/manifest.json` configuré avec icônes et thème.
*   **Service Worker** : Généré automatiquement au build pour le cache et le mode hors-ligne.
*   **Test** : Ouvrez les DevTools > Application > Manifest pour vérifier la validité.

## 🤝 Contribution

1.  Forker le projet
2.  Créer une branche (`git checkout -b feature/AmazingFeature`)
3.  Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4.  Push sur la branche (`git push origin feature/AmazingFeature`)
5.  Ouvrir une Pull Request

---

Droit d'auteur © 2025 PHOENIX SOLAR ENERGY. Tous droits réservés.
