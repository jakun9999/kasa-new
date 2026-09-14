### kasa-new
Nouvelle interface utilisateur pour KASA - entreprise de location d’appartements et de maisons entre particuliers.

Code backend : https://github.com/OpenClassrooms-Student-Center/dev-react-P12

Maquette figma : https://www.figma.com/design/UEw5iG40U3V0NeqBr91rd9/KASA-NEW?node-id=44-653&t=2fL3PR1lZG6K1cUw-0

## Tests unitaires (Vitest)

Les tests colocalisés (`*.test.tsx` à côté du composant) tournent dans jsdom, avec Testing Library.

```bash
npm test          # mode watch (relance au changement)
npm run test:watch
npx vitest run    # une seule passe (CI / avant un commit)
```

Config : `vitest.config.mts` + `vitest.setup.ts` (`@testing-library/jest-dom`).

### Composants testés

| Composant | Fichier de test | Ce qui est vérifié |
| --- | --- | --- |
| `Carousel` | `src/components/ui/carousel/carousel.test.tsx` | **Responsive** : mobile = grande image + **4 miniatures en rangée** ; desktop (`lg+`) = gabarit Figma 616×358 (grille 2×2). Miniatures synchronisées ; flèches en overlay ; boucle ; clavier ← →. Skeleton : `carousel-skeleton.tsx` (2 s en `next dev`). |

Les favoris (Context + `localStorage`) auront leurs tests dans une brique suivante.


