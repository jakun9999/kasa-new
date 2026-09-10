# Cahier des charges — Kasa (formation)

Synthèse des fichiers `CDC/*.txt`. Ces fichiers racine sont **lecture seule** : ne pas les éditer.

## Contexte

Kasa est un leader français de la location d’appartements et de maisons entre particuliers (~500 nouvelles annonces / jour). Le site historique (ASP.NET, > 10 ans) est devenu difficile à maintenir.

**Laura (CTO)** lance une refonte JavaScript moderne :

- Back-end : **Express.js déjà disponible et documenté**
- Front-end à développer : **Next.js**
- Design : maquette Figma fournie

Rôle de Matthieu : **développeur front-end freelance**. Livrer une interface branchée sur l’API, performante et accessible.

L’API gère utilisateurs et propriétés, avec trois rôles : **Owner**, **Client**, **Admin**. Le mail de Laura précise **deux sprints** : se concentrer sur le **sprint 1** ; le sprint 2 n’est pas prioritaire.

## Ressources officielles (lecture seule)

- Backlog + specs : [Product Backlog Kasa (Notion)](https://app.notion.com/p/openclassrooms/Product-Backlog-et-sp-cifications-techniques-pour-le-site-de-Kasa-25d484f1fa6180c7924beb3ae178fa58)
- Maquette (lien de travail, 9 sept. 2026) : [Figma KASA-NEW](https://www.figma.com/design/CaJq57v4Wb29KMa7ZW5PXv/KASA-NEW?node-id=0-1&t=kzearpZQdrgeHYgT-1) — file key `CaJq57v4Wb29KMa7ZW5PXv`, page `0:1`
- Lien aussi listé dans `Ressources.txt` (ne pas modifier ce fichier) : `UEw5iG40U3V0NeqBr91rd9` — peut être un doublon / ancienne copie ; **préférer le lien de travail ci-dessus** tant que Matthieu l’utilise.
- Backend : [OpenClassrooms-Student-Center/dev-react-P12](https://github.com/OpenClassrooms-Student-Center/dev-react-P12)

Le backlog Notion n’est pas extractible sans session. **Avant de coder**, Matthieu doit ouvrir Notion et coller / exporter ici le découpage sprint 1 vs sprint 2 si un agent en a besoin.

## Étapes officielles (sprint 1)

### 1. Initialiser Next.js

- App Router (TypeScript au choix)
- Arborescence : `app/`, `components/`, `lib/`
- Accessible sur localhost
- Dépôt Git + commit `Initial commit` + GitHub

### 2. Accès API

- Lancer le backend localement
- Service front pour récupérer les propriétés
- Preuve : données en console ou page temporaire

### 3. Layout + design global

- Header / Footer conformes Figma, tous breakpoints
- Styles généraux = maquette
- Identifier composants réutilisables, Server vs Client Components

### 4. Page d’accueil (liste)

- Toutes les propriétés, responsive
- `next/image`
- Loader / skeleton
- Aucun warning au chargement

### 5. Page détail d’une propriété

- Carrousel dynamique
- URL par **slug**
- UX soignée
- **Tests unitaires du carrousel**
- Si **une seule image** : pas de contrôles de navigation (règle d’affichage)

### 6. Favoris

- Ajout / retrait
- Persistance après fermeture du navigateur via **`localStorage`**
- **Tests unitaires des favoris**

### 7. SEO / perf

- Sitemap
- Rendu **côté serveur** autant que possible
- Microdonnées **Schema.org**
- Lighthouse **tout au vert**
- Tester les résultats enrichis Google

### 8. Accessibilité

- Pas d’erreur d’accessibilité
- WAVE et/ou Lighthouse (WCAG 2.1 AA) ; AChecker possible

### 9. Documentation

- JSDoc et/ou Storybook
- README GitHub : comment lancer le projet (checklist)

## Checklist technique complémentaire

- Front = Next.js + React
- SEO : Schema.org + meta pertinentes
- Perf : scores Lighthouse au vert
- Images : `next/image` + lazy loading des listes
- A11y : WCAG 2.1 AA
- README GitHub
- JSDoc ou Storybook
- Tests unitaires : diaporama **et** favoris
- Code clair, composants réutilisables
- Responsive desktop, tablette, mobile

## Sprint 2 (non prioritaire)

Le mail et l’API laissent entendre, **si le backlog Notion le confirme** : authentification (register/login), CRUD propriétés côté Owner, uploads, éventuellement messagerie maquettée, favoris API authentifiés.

Ne pas commencer le sprint 2 tant que le sprint 1 n’est pas soutenable (app déployée, tests, Lighthouse, a11y, docs, démo prête).

## Tension favoris (à trancher avec Notion)

Les **étapes officielles** imposent `localStorage` sans mention de compte.

L’**API** expose `POST/DELETE /api/properties/:id/favorite` **avec JWT**.

Pour le sprint 1, suivre les étapes : **`localStorage`**. Ne brancher l’API favoris que si le backlog sprint 1 l’exige, ou en sprint 2.
