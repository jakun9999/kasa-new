# Conventions de développement (quand le code commencera)

N’applique ces règles qu’après demande explicite de coder. Elles évitent les impasses classiques de ce brief.

## Rythme (non négociable)

Matthieu prépare une **soutenance** : il doit pouvoir expliquer chaque fichier. Donc :

1. Attendre son go pour la brique suivante.
2. Un périmètre étroit (un composant, une route, un hook).
3. S’appuyer sur les tokens / SVG déjà dans `.cursor/docs/` et `figma-export/` ; pour tout nouveau UI, attendre sa capture Figma.
4. Commenter peu, nommer bien ; si un choix n’est pas évident (Server vs Client, hug vs largeur fixe), le dire en une phrase dans la réponse, pas dans un roman.
5. Interdit : scaffold de toutes les pages, Storybook de 20 composants, ou layout home+détail « pour avancer ».

## Emplacement du code

Recommandé : `c:\Users\matth\OneDrive\Desktop\p8\kasa\` (frère de `CDC`).  
Au `create-next-app`, copier `AGENTS.md` et `.cursor/docs/` dans ce repo pour que les agents suivants aient le contexte.

Ne pas écraser les `.txt` du CDC.

## Stack cible

- Next.js **App Router** (impératif)
- React
- TypeScript **recommandé** (le brief laisse le choix)
- CSS : Tailwind possible (Matthieu l’a demandé) **ou** CSS/Sass modules ; coller Figma, pas de lib UI
- Couleurs : uniquement celles de `.cursor/docs/tokens-couleurs.md` (pas l’ancien `#FF6060`)
- Typo : **Inter** via `next/font`, line-height **1.426** (142,6 %) partout — `.cursor/docs/tokens-typo.md` (pas Montserrat)
- Boutons : 9 variantes, medium/long en `w-fit` — `.cursor/docs/tokens-boutons.md`
- Assets : SVG dans `figma-export/` — `.cursor/docs/tokens-assets.md`
- Jest + React Testing Library
- ESLint (`eslint-config-next`)

## Arborescence minimale (brief)

```
app/           # routes, layout, metadata, sitemap
components/    # UI réutilisable
lib/           # client API, favoris, utils
```

Compléments utiles : `app/logements/[slug]/`, `components/ui/`, `components/property/`, `lib/api/`, `__tests__/` ou colocation `*.test.tsx`.

## Server vs Client

- **Server Components par défaut** (étape 7 : SSR autant que possible).
- `"use client"` seulement si : état, effets, `localStorage`, handlers, carrousel.
- Fetch liste / détail **côté serveur** (`fetch` dans page ou `lib/`).
- Ne pas wrapper tout le layout en client.

## Images

- Toujours `next/image`
- `remotePatterns` pour le bucket OC et, si besoin, l’host du backend (`localhost` en dev)
- `alt` pertinents (titre + localisation)
- Lazy sur la grille d’accueil

## Carrousel (tests + a11y)

- Navigation circulaire si plusieurs images
- **Une image** : pas de flèches ni de compteur (sauf si Figma dit autrement — Figma gagne)
- Boutons nommés (`aria-label`), image visible avec `alt`
- Tests : next, prev, wrap, single image, clavier si la maquette le prévoit

## Favoris sprint 1

- `localStorage`, clé stable (ex. `kasa:favorites`)
- IDs (ou slugs) de propriétés
- Hook client mince ; UI (cœur) isolée et testable
- Hydration : ne pas lire `localStorage` pendant le SSR (état initial identique serveur/client, puis sync `useEffect`)

## SEO

- `generateMetadata` par page
- `app/sitemap.ts` (URLs home + chaque slug)
- JSON-LD Schema.org adapté à un logement (`Accommodation` / `Product` / `Offer` — choisir **un** type cohérent et le valider avec l’outil Google)
- Page 404 si Figma / Notion la prévoit

## Accessibilité

- Contraste Figma (vérifier, le rouge Kasa historique est parfois juste)
- Focus visible, skip link si pertinent
- Landmarks : header / main / footer
- Cible WCAG 2.1 AA, WAVE sans erreur bloquante

## Documentation livrable

- README : prérequis, lancer **front + back**, `.env.example`, scripts test/lint/build, lien Figma (sans modifier Figma)
- JSDoc sur services / hooks publics **ou** Storybook des composants (Header, Card, Carousel, Collapse, FavoriteButton)

## Qualité soutenance

- Commits lisibles après `Initial commit`
- Pas de secrets dans Git
- Pas de `console.log` de debug sur la démo
- Composants petits et réutilisables (Card, Collapse, Rating, Carousel)

## Vérifications UI

Toute modification d’interface se vérifie dans le navigateur (home, détail, favoris, mobile + desktop), pas seulement par capture.
