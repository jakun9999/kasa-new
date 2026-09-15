### kasa-new
Nouvelle interface utilisateur pour KASA - entreprise de location d’appartements et de maisons entre particuliers.

Code backend : https://github.com/OpenClassrooms-Student-Center/dev-react-P12

Maquette figma : https://www.figma.com/design/UEw5iG40U3V0NeqBr91rd9/KASA-NEW?node-id=44-653&t=2fL3PR1lZG6K1cUw-0

## Tests unitaires (Vitest)

Les tests colocalisés (`*.test.ts` / `*.test.tsx`) tournent dans jsdom, avec Testing Library.

```bash
npm test          # une passe (CI / avant un commit)
npm run test:watch
npx vitest run    # alias explicite d’une passe
```

Config : `vitest.config.mts` + `vitest.setup.ts` (`@testing-library/jest-dom`).

### Composants / modules testés

| Cible | Fichier de test | Ce qui est vérifié |
| --- | --- | --- |
| `Carousel` | `src/components/ui/carousel/carousel.test.tsx` | Miniatures synchronisées ; flèches en overlay ; boucle ; clavier ← → ; pas de flèches si 1 image. |
| `PropertyCard` (favoris UI) | `src/components/ui/cards/property-card.test.tsx` | Cœur client : add / remove (`aria-pressed`) ; persistance `localStorage` (`kasa:favorites`) ; état restauré après remount ; le clic cœur ne déclenche pas la navigation du lien parent. |
| Helpers favoris | `src/lib/favorites.test.ts` | Toggle / filtre d’ids ; `favoris=1` uniquement (garde URL) ; lecture / écriture `localStorage`. |

### Favoris — ce qu’on teste et pourquoi

- **UI = `PropertyCard`** (`"use client"`) : c’est le seul endroit où le visiteur interagit avec le ❤️. On monte la card sous `Providers` (Auth + Favorites), on mocke `fetch` en 401 pour rester en mode **visiteur** (`localStorage`), puis on simule les clics.
- **Logique pure = `lib/favorites.ts`** : toggle, filtre grille, parsing du query param — testable sans React, utile pour la soutenance (séparer store et UI).
- **Pas de test page serveur** pour le filtre `/?favoris=1` : le filtrage réel se fait côté client dans `PropertyGrid` à partir des ids du Context (jamais des ids injectés dans l’URL).
