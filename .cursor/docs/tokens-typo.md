# Tokens Figma KASA-NEW — typographie

Source : inventaire Figma fourni par Matthieu, 9 septembre 2026.  
Famille unique : **Inter** (Google Fonts).  
**Line-height : 142,6 % partout** (CSS unitless `1.426`). Letter-spacing : non fourni.

## Inventaire brut

| Rôle probable | Famille | Graisse | Taille | Occ. | Exemple |
| --- | --- | --- | --- | --- | --- |
| Titre spécial (404) | Inter | Black | 100 px | ×2 | "404" |
| H1 — Titres principaux | Inter | Bold | 32 px | ×8 | "À propos" |
| H1 alt | Inter | Medium | 32 px | ×2 | "Messages" |
| H1 alt (couleurs/labels) | Inter | Regular | 32 px | ×7 | "Main red" |
| H2 — Sous-titres | Inter | Bold | 24 px | ×2 | "Heureux de vous revoir" |
| H2 alt | Inter | Semi Bold | 24 px | ×2 | "Comment ça marche ?" |
| H2 alt | Inter | Medium | 24 px | ×3 | "Appartement cosy" |
| H2 alt (navigation) | Inter | Regular | 24 px | ×4 | "Accueil" |
| H3 — Sous-sections | Inter | Bold | 18 px | ×2 | "Notre mission est simple :" |
| Body large | Inter | Medium | 18 px | ×39 | "Que vous cherchiez un appartement…" |
| Body — Labels | Inter | Medium | 16 px | ×2 | "Votre hôte" |
| Body — Noms | Inter | Regular | 16 px | ×4 | "Nathalie Jean" |
| Body small — Nav/boutons | Inter | Bold | 14 px | ×1 | "Accueil" |
| Body small — Liens/actions | Inter | Medium | 14 px | ×106 | "Retour aux annonces" |
| Body small — Texte courant | Inter | Regular | 14 px | ×140 | "Accueil" |
| Caption — Footer/meta | Inter | Medium | 12 px | ×19 | "© 2025 Kasa…" |
| Caption — Tags/détails | Inter | Regular | 12 px | ×115 | "Cafetière" |
| Overline — Mini texte | Inter | Regular | 10 px | ×38 | "Bonjour, votre appartement…" |
| Micro — Labels très petits | Inter | Regular | 8 px | ×26 | "Utilisateur" |

## Graisses à charger

| Figma | CSS / Tailwind |
| --- | --- |
| Regular | 400 |
| Medium | 500 |
| Semi Bold | 600 |
| Bold | 700 |
| Black | 900 |

Next.js : `next/font/google` → `Inter({ subsets: ['latin'], weight: ['400','500','600','700','900'] })`.  
Ne pas charger d’autre famille (pas Montserrat, contrairement à l’ancien Kasa).

## Line-height (homogène)

Règle unique, **tous** les styles y compris le 404 :

| Figma | CSS | Tailwind |
| --- | --- | --- |
| 142,6 % | `line-height: 1.426` | `leading-[1.426]` ou `--leading-kasa: 1.426` |

Préférer le **unitless** `1.426` (équivalent à 142,6 %) plutôt que des px, pour que ça suive la `font-size`.

Équivalents px (info, ne pas durcir en px dans le CSS) :

| Font-size | Line-height |
| --- | --- |
| 100px | 142,6px |
| 32px | 45,632px |
| 24px | 34,224px |
| 18px | 25,668px |
| 16px | 22,816px |
| 14px | 19,964px |
| 12px | 17,112px |
| 10px | 14,26px |
| 8px | 11,408px |

Implémentation : `body { line-height: 1.426 }` + même valeur sur les `fontSize` Tailwind. Ne pas utiliser `leading-none` / `leading-tight` sauf exception Figma (aucune identifiée).

## Échelle d’implémentation (sémantique)

Le scan mélange **UI produit** et **pages de doc Figma** (ex. labels « Main red » en 32 Regular). Pour le front, partir de ça et coller la frame si conflit :

| Token | Taille | Graisse par défaut | Où |
| --- | --- | --- | --- |
| `display` | 100px | 900 | page 404 uniquement |
| `h1` | 32px | 700 | titres de page (« À propos ») |
| `h1-medium` | 32px | 500 | titres d’app (« Messages ») |
| `h2` | 24px | 700 | hero / accueil connecté |
| `h2-semibold` | 24px | 600 | sections (« Comment ça marche ? ») |
| `h2-medium` | 24px | 500 | titres de cards logement |
| `nav` | 24px | 400 | liens header (desktop) — confirmer sur maquette |
| `h3` | 18px | 700 | sous-sections |
| `lead` | 18px | 500 | intro / body large |
| `label` | 16px | 500 | « Votre hôte » |
| `name` | 16px | 400 | nom d’hôte |
| `btn` | 14px | 700 | boutons (rare dans le scan) |
| `action` | 14px | 500 | liens, CTA secondaires |
| `body` | 14px | 400 | texte courant, nav compacte |
| `caption-strong` | 12px | 500 | footer © |
| `caption` | 12px | 400 | tags, équipements |
| `overline` | 10px | 400 | micro-copy (chat, etc.) |
| `micro` | 8px | 400 | **éviter pour du texte essentiel** (sous 12px, a11y) |

## Tailwind (quand le code commencera)

```js
fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
fontSize: {
  display: ['6.25rem', { lineHeight: '1.426' }],   // 100px
  h1: ['2rem', { lineHeight: '1.426' }],           // 32px
  h2: ['1.5rem', { lineHeight: '1.426' }],         // 24px
  h3: ['1.125rem', { lineHeight: '1.426' }],       // 18px
  lead: ['1.125rem', { lineHeight: '1.426' }],
  body: ['0.875rem', { lineHeight: '1.426' }],     // 14px
  caption: ['0.75rem', { lineHeight: '1.426' }],   // 12px
  overline: ['0.625rem', { lineHeight: '1.426' }], // 10px
},
```

## Accessibilité

- Corps de page : 14px est limite ; ne pas descendre en dessous pour le texte principal.
- `8px` / `10px` : décoratif ou non essentiel uniquement ; Lighthouse / WAVE pourront alerter.
- Contraste : texte `#0D0D0D` (voir `tokens-couleurs.md`).

## Indices fonctionnels (hors typo)

Le scan mentionne des écrans **sprint 2 possibles** : 404, À propos, Messages, login (« Heureux de vous revoir »), Comment ça marche, fiche logement, footer. À recouper avec Notion avant d’implémenter.

## Manquant

Letter-spacing (si ≠ 0), ombres, grilles de pages. Radius boutons : voir `tokens-boutons.md`. Captures de frames pour valider les poids.
