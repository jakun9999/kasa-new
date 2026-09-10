# État du projet (à tenir à jour)

Dernière mise à jour : **10 septembre 2026**.

## Décisions prises

- Deadline soutenance : **27 septembre 2026**
- Front : ce repo `kasa-new` (Next.js App Router, TypeScript, Tailwind v4)
- Ce dossier `CDC/` = brief lecture seule
- Thème Tailwind : couleurs `kasa-*`, Inter 400–900, line-height `1.426`, logos `public/logos/` = copies inchangées de `figma-export/logos/`
- Maquette de travail : [KASA-NEW `CaJq57v4Wb29KMa7ZW5PXv`](https://www.figma.com/design/CaJq57v4Wb29KMa7ZW5PXv/KASA-NEW?node-id=0-1&t=kzearpZQdrgeHYgT-1)
- Fetch anonyme de ce fichier : **403** (privé)
- Palette extraite (voir `tokens-couleurs.md`) : Main red `#99331A`, Dark orange `#842C16`, Light orange `#FFFBF9`, Noir `#0D0D0D`, Blanc `#FFFFFF`, Gris light `#F5F5F5`, Gris dark `#565656`
- Typo : **Inter** 400–900, 8–100px, line-height **142,6 %** (`1.426`) partout — voir `tokens-typo.md` (pas Montserrat)
- Logos SVG : `figma-export/logos/` — gradients encore proches de `#FF6060` ; **ne pas retracer**
- Icônes : `figma-export/icons/` (11 SVG) — voir `tokens-assets.md`
- Boutons CTA : **9** = short 32×32 fixe / medium hug pad 16 / long hug pad 32 × couleurs Main red, Dark orange, Gris light — voir `tokens-boutons.md`. Radius 5px (short) et 10px (medium/long).
- **Livraison incrémentale** : pas d’autre composant / page tant que Matthieu ne l’a pas demandé. Il garde la maîtrise du code pour l’oral.
- Backlog Notion : 6 stories sprint 1 (dont **login** et **bouton messagerie**) ; page Favoris + envoi message + CRUD hôte + inscription = sprint 2. Détail : `backlog.md`.

## Décisions ouvertes

- [x] Dossier du front → **ce repo `kasa-new`**
- [x] TypeScript ou JavaScript → **TypeScript**
- [x] Sass vs CSS Modules → **Tailwind v4** (`@theme` dans `globals.css`)
- [ ] JSDoc seul vs Storybook
- [ ] Contenu exact sprint 1 vs 2 → **tranché** (voir `backlog.md`)
- [ ] Hébergement front + stratégie backend en démo

## Sprint 1

- [x] 1. Next.js + GitHub
- [x] 2. API propriétés
- [x] 3. Tokens Tailwind (issue #03) — layout Header/Footer encore à faire
- [ ] 4. Accueil liste
- [ ] 5. Détail + carrousel testé
- [ ] 6. Favoris `localStorage` testés
- [ ] 7. Sitemap + Schema.org + Lighthouse vert
- [ ] 8. Accessibilité
- [ ] 9. JSDoc / Storybook + README
- [ ] Déploiement
- [ ] Répétition orale 15 min

## Sprint 2 (optionnel)

- [ ] Non commencé (et non prioritaire)
