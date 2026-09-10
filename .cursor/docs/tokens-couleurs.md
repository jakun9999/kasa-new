# Tokens Figma KASA-NEW — couleurs

Source : variables / styles Figma, capture du 9 septembre 2026.  
Maquette : [KASA-NEW](https://www.figma.com/design/CaJq57v4Wb29KMa7ZW5PXv/KASA-NEW?node-id=0-1&t=kzearpZQdrgeHYgT-1)

Ne pas réutiliser l’ancien rouge Kasa (`#FF6060`). La refonte utilise une terracotta.

## Palette

| Nom Figma | Hex | Usage probable (à confirmer sur les frames) |
| --- | --- | --- |
| Main red | `#99331A` | Couleur de marque, CTA, logo, accents |
| Dark orange | `#842C16` | Hover / état actif du rouge, titres secondaires |
| Light orange | `#FFFBF9` | Fond de page / fond chaud très clair |
| Noir | `#0D0D0D` | Texte principal |
| Blanc | `#FFFFFF` | Texte sur fond sombre, cartes, header inverse |
| Gris light | `#F5F5F5` | Fonds de sections, skeletons, chips |
| Gris dark | `#565656` | Texte secondaire, captions, footer |

## Mapping Tailwind (quand le code commencera)

Noms proposés — ne pas inventer d’autres hex.

```js
colors: {
  kasa: {
    red: '#99331A',
    'red-dark': '#842C16',
    cream: '#FFFBF9',
    black: '#0D0D0D',
    white: '#FFFFFF',
    'gray-light': '#F5F5F5',
    'gray-dark': '#565656',
  },
}
```

Tailwind v4 (`@theme`) équivalent :

```css
@theme {
  --color-kasa-red: #99331A;
  --color-kasa-red-dark: #842C16;
  --color-kasa-cream: #FFFBF9;
  --color-kasa-black: #0D0D0D;
  --color-kasa-white: #FFFFFF;
  --color-kasa-gray-light: #F5F5F5;
  --color-kasa-gray-dark: #565656;
}
```

## Contraste (a11y, à vérifier en sprint 8)

- Texte `#0D0D0D` sur `#FFFFFF` / `#FFFBF9` / `#F5F5F5` : OK.
- Texte blanc sur `#99331A` : à valider (terracotta assez sombre, souvent OK pour du grand texte).
- Texte `#565656` sur `#FFFFFF` : viser AA pour le body ; éviter ce gris pour du petit texte sur `#F5F5F5`.

## Manquant

Typo : voir `tokens-typo.md`. Boutons : radius **5px** (short) / **10px** (medium–long), voir `tokens-boutons.md`. Restent ombres, grilles, captures de pages.
