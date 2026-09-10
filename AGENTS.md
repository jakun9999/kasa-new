# Instructions permanentes pour les agents — projet Kasa

Matthieu, ingénieur / product manager en formation. Workspace actuel : dossier **CDC** (cahier des charges uniquement). Aucun code applicatif n’existe encore.

Lis d’abord ce fichier, puis `.cursor/docs/` avant toute action.

## Interdits (non négociables)

- Ne **modifie jamais** les 6 fichiers existants à la racine de `CDC/` : `description_mission.txt`, `description_soutenance.txt`, `etapes_du_projet.txt`, `checklist.txt`, `Ressources.txt`, `mail_laura.txt`.
- Ne **modifie jamais** les ressources en ligne du brief : backlog Notion, maquette Figma, dépôt GitHub du backend officiel. Lecture / clone local uniquement.
- Ne **pousse jamais** de commits vers `OpenClassrooms-Student-Center/dev-react-P12`.
- Ne **code pas** et ne **génère pas** de projet applicatif tant que Matthieu ne l’a pas demandé explicitement.
- N’invente pas de pages, de copy ou de comportements absents de la maquette Figma et du backlog Notion.
- **Pas de génération en masse.** Le reste des composants, layouts et pages se fait **au fur et à mesure**, quand Matthieu l’a demandé, avec ses exports Figma du moment. Objectif : qu’il **maîtrise et comprenne** le code pour la soutenance (questions Laura / Ingrid). Un gros dump « site complet » est interdit.

## Méthode (soutenance)

- Une brique à la fois (ex. tokens Tailwind, puis `Button`, puis layout, puis une page).
- Après chaque brique : diff petit, noms clairs, 2–3 phrases sur le *pourquoi* (il devra le redire à l’oral).
- Ne pas anticiper Header, grilles, carrousel, favoris, etc. tant qu’ils n’ont pas été cadrés avec lui.
- S’il demande une page : n’implémenter que cette page + les composants **nécessaires**, pas tout le design system.
- Tokens déjà figés (couleurs, Inter, line-height 1.426, 9 boutons, SVG) = base autorisée ; le reste attend.

## Mission

Refonte **front-end** du site Kasa (location entre particuliers) en **Next.js (App Router) + React**, branchée sur une **API Express déjà fournie**. Priorité : **sprint 1**. Sprint 2 seulement s’il reste du temps.

**Deadline soutenance : dimanche 27 septembre 2026.**

## Sources de vérité (ordre)

1. Backlog Notion (sprint 1 vs 2) — synthèse dans `.cursor/docs/backlog.md` (capture du 9 sept. 2026).
2. Maquette Figma `KASA-NEW` — [lien de travail](https://www.figma.com/design/CaJq57v4Wb29KMa7ZW5PXv/KASA-NEW?node-id=0-1&t=kzearpZQdrgeHYgT-1) (file key `CaJq57v4Wb29KMa7ZW5PXv`). Pixel-perfect, desktop / tablette / mobile. Ne pas modifier le fichier Figma. Les agents distants n’y ont **pas** accès (403 sans session OpenClassrooms).
3. Étapes + checklist du dossier `CDC/`.
4. Backend officiel + OpenAPI locale (`http://localhost:3000/docs.html`) une fois le serveur lancé.
5. Les docs dans `.cursor/docs/`.

## Livrable sprint 1 (obligatoire)

Application Next.js : liste des propriétés, fiche détail (carrousel + slug), favoris persistés via **`localStorage`**, layout Header/Footer, responsive, SSR autant que possible, sitemap, Schema.org, Lighthouse au vert, accessibilité WCAG 2.1 AA, tests unitaires (carrousel **et** favoris), JSDoc et/ou Storybook, README GitHub, déploiement.

## Décisions à confirmer au premier sprint de code

- Créer l’app dans un dossier **frère** `p8/kasa` (recommandé) pour laisser `CDC/` intact, et **copier** `AGENTS.md` + `.cursor/docs/` dans ce nouveau workspace.
- TypeScript recommandé (optionnel dans le brief).
- Styles : suivre Figma ; Sass modules ou CSS modules, pas de lib UI qui casse la maquette.
- Favoris sprint 1 = `localStorage` (étapes officielles), même si l’API expose des favoris authentifiés (plutôt sprint 2).

## Fichiers d’aide

| Fichier | Contenu |
| --- | --- |
| `.cursor/docs/taches-github.md` | Issues à créer (`gh`) + critères + milestones |
| `.cursor/docs/backend-api.md` | API Express, endpoints, modèle, ports |
| `.cursor/docs/plan-et-soutenance.md` | Calendrier jusqu’au 27/09, déroulé de soutenance |
| `.cursor/docs/conventions-dev.md` | Architecture, SSR vs client, tests, a11y, SEO |
| `.cursor/docs/tokens-couleurs.md` | Palette Figma (hex) + mapping Tailwind |
| `.cursor/docs/tokens-typo.md` | Inter : tailles, graisses, tokens sémantiques |
| `.cursor/docs/tokens-boutons.md` | CTA : 9 variantes (3 longueurs × 3 couleurs), hug medium/long |
| `.cursor/docs/tokens-assets.md` | Logos, icônes SVG, captures |

Quand le projet applicatif existera, mets à jour `.cursor/docs/etat-du-projet.md`. Si Matthieu donne `owner/repo` et demande les tickets : créer les issues via `gh` **depuis** `taches-github.md` (pas à la main dans Notion, pas de duplication fantaisiste).
