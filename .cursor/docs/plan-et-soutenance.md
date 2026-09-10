# Calendrier et soutenance

Aujourd’hui : **mercredi 9 septembre 2026**.  
Soutenance / deadline : **dimanche 27 septembre 2026**.  
Marge réelle : **~18 jours**, dont ~12 jours utiles si on réserve 3–4 jours à polish, déploiement et oral.

## Priorité absolue

Un sprint 1 **démo-ready** vaut mieux qu’un sprint 2 incomplet. Ne pas sacrifier Lighthouse, a11y, tests et oral pour de l’auth.

Le calendrier ci-dessous est un **ordre de priorité**, pas un permis de tout générer d’un coup. Matthieu avance brique par brique pour comprendre le code en soutenance.

## Planning proposé

| Quand | Objectif | Étapes CDC |
| --- | --- | --- |
| 9 sept. | Cadrage, lecture Figma + Notion, choix dossier app | — |
| 10 sept. | Next.js App Router, GitHub, arborescence | 1 |
| 11 sept. | Clone backend, client API, page temporaire | 2 |
| 12–13 sept. | Layout Header/Footer, tokens Figma, responsive | 3 |
| 14 sept. | Home + `next/image` + skeleton | 4 |
| 15–16 sept. | Fiche détail, slug, carrousel (cas 1 image) + tests | 5 |
| 17 sept. | Favoris `localStorage` + tests | 6 |
| 18–19 sept. | Sitemap, SSR, Schema.org, Lighthouse | 7 |
| 20 sept. | WAVE / a11y | 8 |
| 21 sept. | JSDoc ou Storybook, README | 9 |
| 22–23 sept. | Buffer bugs, déploiement (Vercel + backend ou mock documenté) | checklist |
| 24–25 sept. | Répétition orale 15 min, questions Laura | soutenance |
| 26 sept. | Buffer | — |
| **27 sept.** | **Soutenance** | — |

Si le sprint 1 est **fermé le 21**, alors seulement : login / register, favoris API, création de bien Owner — et uniquement les écrans présents dans Figma / Notion.

## Contrainte déploiement (question de soutenance)

L’évaluateur posera le **déploiement**. Prévoir tôt :

- Front : Vercel (Next.js)
- Back : Render / Railway **ou** documenter clairement que l’API tourne en local + comment la lancer
- Variables d’environnement, CORS, `next/image` domains
- Ne pas laisser un `localhost` en production

## Déroulé de soutenance (30 min)

L’évaluateur joue **Laura** (CTO) sur les livrables, puis **Ingrid** (dev qui reprend le projet). À la fin, débrief hors rôle.

### 1. Présentation des livrables — 15 min (± 5)

**Hors créneau 10–20 min = risque de refus.** Viser 15.

1. **Contexte (2 min)** : Kasa, refonte ASP.NET → Next.js + API Express, rôle freelance, sprint 1.
2. **Démo (8–9 min)** : home responsive → fiche + carrousel (plusieurs images **et** une image) → favoris + rechargement page → éventuellement 404. Parler SSR, slug, `next/image`.
3. **Performances / accessibilité (4 min)** : captures Lighthouse (4 verts), WAVE, Schema.org, sitemap, choix Server vs Client Components.

### 2. Discussion — 10 min (Laura)

Préparer des réponses courtes, avec un exemple dans le code :

- **Bonnes pratiques** : App Router, composition, Server Components par défaut, client seulement pour carrousel / favoris, pas de duplication Header, types, ESLint
- **Tests unitaires** : Jest + Testing Library ; carrousel (next/prev, wrap, 1 image) ; favoris (add/remove/persist — mock `localStorage`)
- **Déploiement** : pipeline, env, limites du backend SQLite fichier

### 3. Débrief — 5 min

Sortie des rôles. Points forts / axes. Rester factuel.

## Artefacts à avoir le jour J

- App en ligne **ou** localhost ultra-stable + backend lancé
- Repo GitHub + README
- Rapport / captures Lighthouse + WAVE
- 2–3 extraits de tests
- Lien Storybook ou exemples JSDoc
- Plan oral minute par minute (ne pas dépasser 15 min de présentation)
