# Composant Figma « call to action » — boutons

Sources (9 sept. 2026) :

- `figma-export/screenshots/components/button_short.png` — longueur **short**, couleur inspectée **Gris light**
- `figma-export/screenshots/components/button_medium.png` — longueur **medium**, couleur inspectée **Dark orange**
- `figma-export/screenshots/components/buttons_long.png` — longueur **long**, couleur inspectée **Main red**

Matthieu n’a exporté **qu’une couleur par longueur** pour limiter les PNG. Il y a bien **9 variantes** : 3 longueurs × 3 couleurs. Ne pas conclure qu’il n’existe que 3 boutons.

## Matrice (9)

|  | Main red `#99331A` | Dark orange `#842C16` | Gris light `#F5F5F5` |
| --- | --- | --- | --- |
| **Short** | fond red, icône Blanc | fond orange, icône Blanc | fond gris light, icône Gris dark |
| **Medium** | idem, largeur **hug** | idem, largeur **hug** | idem, largeur **hug** |
| **Long** | idem, largeur **hug** | idem, largeur **hug** | idem, largeur **hug** |

Contenu (texte / icône) :

- **Short** : icône seule, **dimensions figées 32×32**.
- **Medium** et **Long** : largeur **non figée** (`hug` / `width: fit-content`). Ça grandit avec le **libellé** et l’**icône** éventuelle. Ne pas imposer 80px / 96px (valeurs Figma pour le mot « label » uniquement).

Hauteur medium / long observée : **36px** (hug + padding vertical 8).

## Specs par longueur

|  | Short | Medium | Long |
| --- | --- | --- | --- |
| Largeur | **32px fixe** | hug | hug |
| Hauteur | **32px fixe** | hug (~36px) | hug (~36px) |
| Padding | 16h / 8v (boîte contrainte à 32) | **16px** / 8px | **32px** / 8px |
| Gap icône–texte | n/a | **0** (à recoller sur frame si l’icône a une marge interne) | **10px** |
| Radius | **5px** | **10px** | **10px** |
| Layout | auto-layout H, centré | auto-layout H, centré (légèrement start) | idem |
| Contenu | icône 16×16 typique | texte ± icône | texte ± icône |
| Resize | fixed | hug × hug | hug × hug |

Label : Inter, 14px, graisse Bold ou Medium (typo « Nav/boutons » / « Liens ») ; line-height **1.426**. Recoller le poids sur une frame réelle.

## Couleurs (les 3, même si un seul PNG les montre)

Sur **Main red** et **Dark orange** :

- Fill = token de couleur
- Texte + icône = **Blanc** `#FFFFFF`
- Stroke **1px Blanc inside** observé sur le medium Dark orange — appliquer aux deux fonds sombres tant qu’une frame ne dit pas le contraire

Sur **Gris light** :

- Fill = `#F5F5F5`
- Texte + icône = **Gris dark** `#565656`
- Pas de stroke blanc observé sur le short gris

Hover / disabled : **non documentés** (pas dans ces PNG).

## Implémentation (quand on coderá)

Un seul composant `Button` avec props du type `size: 'short' | 'medium' | 'long'` et `color: 'red' | 'orange' | 'gray'`, plus `icon?` et `children?`.

- Short : `w-8 h-8` (32px), `rounded-[5px]`, `p-0` ou padding interne centré, **pas de texte**.
- Medium / long : `w-fit h-fit`, `rounded-[10px]`, `py-2` (8px), `px-4` (16) vs `px-8` (32).
- Icônes dans le bouton : `currentColor` (les SVG exportés sont souvent `fill="black"` — à surcharger, ne pas dupliquer 3 fichiers par couleur).
- Interdit : largeur Tailwind fixe (`w-24`, etc.) sur medium/long.

## Captures = documentation, pas masque pixel

Les PNG montrent tout le set Figma autour du bouton sélectionné. Les mesures à suivre sont celles du **panneau droit** du variant sélectionné + les règles de Matthieu (hug medium/long).
