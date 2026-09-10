# Tâches GitHub (issues + Project)

Quand le repo front existe, Matthieu dit : **« Crée les issues GitHub depuis `.cursor/docs/taches-github.md` »** et donne `owner/repo`.

L’agent utilise `gh` (pas l’UI). Une brique de code à la fois ; les tickets servent au **suivi**, pas à tout implémenter d’un coup.

## Ce que tu prépares (5 min)

1. Créer le repo GitHub (ex. `kasa`) et y copier `AGENTS.md`, `.cursor/docs/`, `figma-export/`.
2. Dans le repo : **Settings → Features → Issues** coché.
3. Sur ta machine, `gh auth status`. Si tu n’es pas connecté : `gh auth login` (navigateur **Chrome**, pas l’onglet Cursor).
4. Ouvrir **ce repo** dans Cursor (pas seulement `CDC/`).
5. Coller dans le chat : `Repo : <ton-user>/kasa — crée les issues + milestones + labels, et un Project « Kasa sprint 1 ».`

Sans URL de repo, l’agent **ne crée rien** sur GitHub.

## Modèle recommandé

| Outil | Rôle |
| --- | --- |
| **Issues** | Une tâche = une issue. Corps = user story + critères d’acceptation (cases à cocher). |
| **Labels** | `sprint-1` `sprint-2` `tech` `page:accueil` `page:propriete` `page:connexion` |
| **Milestones** | Deadline de l’étape (date d’échéance GitHub). |
| **Project** (board) | Colonnes `Backlog` → `En cours` → `Revue` → `Done`. Champ date optionnel = même deadline que le milestone. |

Les dates ci-dessous sont le planning proposé (soutenance **27 sept. 2026**). À ajuster si tu décides d’un autre rythme.

## Labels à créer

```
sprint-1, sprint-2, tech, a11y, tests, seo
page:accueil, page:propriete, page:connexion, page:messagerie, page:favoris, page:ajout
```

## Milestones

| Milestone | Échéance | Contenu |
| --- | --- | --- |
| M1 — Init + API | 2026-09-11 | #01 #02 |
| M2 — Design system | 2026-09-13 | #03 #04 |
| M3 — Accueil | 2026-09-14 | #05 #06 #07 |
| M4 — Fiche | 2026-09-16 | #08 #09 |
| M5 — Favoris | 2026-09-17 | #10 |
| M6 — Auth + message (S1) | 2026-09-18 | #11 #12 |
| M7 — SEO / a11y / docs | 2026-09-21 | #13 #14 #15 |
| M8 — Déploiement + oral | 2026-09-27 | #16 #17 |
| Sprint 2 (optionnel) | 2026-09-27 | #18–#23 |

---

## Issues sprint 1 (créer)

Corps type : coller le bloc sous chaque titre. L’agent préfixe le titre par `[S1]`.

### 01 — Initialiser Next.js (App Router)

- Labels : `sprint-1` `tech` — Milestone : M1 — Due : 11 sept.

```md
## Story
En tant que dev, je veux un projet Next.js versionné pour démarrer le front Kasa.

## Critères d’acceptation
- [ ] App Router, `localhost` OK
- [ ] Dossiers `app/`, `components/`, `lib/`
- [ ] Dépôt Git + commit `Initial commit` + remote GitHub
- [ ] `AGENTS.md`, `.cursor/docs/`, `figma-export/` présents dans le repo
```

### 02 — Brancher l’API propriétés

- Labels : `sprint-1` `tech` — M1

```md
## Story
En tant que visiteur, je veux que le front lise les logements depuis l’API Express.

## Critères d’acceptation
- [ ] Backend officiel lancé **en local** (clone, pas de push OpenClassrooms)
- [ ] Service dans `lib/` qui fetch `GET /api/properties`
- [ ] Données visibles en console ou page temporaire
- [ ] `NEXT_PUBLIC_API_URL` documentée (port front ≠ 3000)
```

### 03 — Thème Tailwind (tokens)

- Labels : `sprint-1` `tech` — M2

```md
## Story
En tant que dev, je veux les couleurs / typo Figma dans le thème pour ne pas inventer de valeurs.

## Critères d’acceptation
- [ ] Couleurs `tokens-couleurs.md` uniquement (pas `#FF6060` UI)
- [ ] Inter via `next/font` (400, 500, 600, 700, 900)
- [ ] `line-height: 1.426` partout
- [ ] Logos SVG de `figma-export/logos/` utilisés tels quels
```

### 04 — Composant Button (9 variantes)

- Labels : `sprint-1` `tech` — M2

```md
## Story
En tant que visiteur, je veux des CTA conformes à la maquette.

## Critères d’acceptation
- [ ] 3 couleurs : Main red, Dark orange, Gris light
- [ ] Short : 32×32 fixe, radius 5px, icône seule
- [ ] Medium / long : largeur hug (texte + icône), radius 10px, pad 16 vs 32
- [ ] Icônes en `currentColor` (pas 9 SVG recolorés à la main)
```

### 05 — Afficher les logements (cards)

- Labels : `sprint-1` `page:accueil` — M3

```md
## Story
En tant que visiteur, je veux voir la liste des logements (images, titres, prix).

## Critères d’acceptation
- [ ] Cards : image, titre, **prix**, bouton ❤️
- [ ] `alt` pertinent sur chaque image
- [ ] `next/image` + skeleton / loader
- [ ] Responsive ; pas de warning au chargement
```

### 06 — Naviguer vers un logement

- Labels : `sprint-1` `page:accueil` `page:propriete` — M3

```md
## Story
En tant que visiteur, je veux cliquer une card pour voir le détail.

## Critères d’acceptation
- [ ] Lien fonctionnel vers la fiche
- [ ] URL basée sur le **slug**
```

### 07 — Layout Header / Footer

- Labels : `sprint-1` `tech` — M2 (peut glisser en M3 si maquette header pas encore exportée)

```md
## Story
En tant que visiteur, je veux un cadre de page identique partout.

## Critères d’acceptation
- [ ] Header + Footer conformes Figma (attendre capture Matthieu)
- [ ] OK desktop / tablette / mobile
- [ ] Server Component par défaut ; client seulement si interactif
```

### 08 — Détail propriété (collapse + contenu)

- Labels : `sprint-1` `page:propriete` — M4

```md
## Story
En tant que visiteur, je veux photos, description, équipements et prix.

## Critères d’acceptation
- [ ] Description, équipements, prix, hôte
- [ ] Collapse cliquables, animation fluide (ouverts/fermés)
- [ ] Accessible (bouton / `aria-expanded`)
```

### 09 — Carrousel + tests

- Labels : `sprint-1` `page:propriete` `tests` — M4

```md
## Story
En tant que visiteur, je veux parcourir les photos du logement.

## Critères d’acceptation
- [ ] Navigation, animation fluide, **boucle** premier ↔ dernier
- [ ] Hauteur fixe, image centrée / croppée
- [ ] **Pas de flèches** (ni compteur si Figma le dit) s’il n’y a **qu’une** image
- [ ] Accessible **clavier**
- [ ] **Tests unitaires** du carrousel
```

### 10 — Favoris (Context + localStorage)

- Labels : `sprint-1` `page:accueil` `tests` — M5

```md
## Story
En tant que visiteur, je veux enregistrer un logement en ❤️.

## Critères d’acceptation
- [ ] Clic ❤️ → cœur rouge
- [ ] Le bien apparaît dans **« Vos favoris »** (accueil, même session)
- [ ] Persistance **localStorage** (revenir plus tard = toujours favori)
- [ ] Context React + pas d’écart SSR / hydration
- [ ] **Tests unitaires** favoris
```

### 11 — Se connecter

- Labels : `sprint-1` `page:connexion` — M6

```md
## Story
En tant qu’utilisateur, je veux me connecter (e-mail + mot de passe).

## Critères d’acceptation
- [ ] Formulaire fonctionnel (`POST /auth/login`)
- [ ] Message d’erreur si identifiants invalides
- [ ] Mot de passe en `type="password"`, JWT stocké de façon raisonnable (pas en clair dans un gist)
- [ ] Page conforme Figma (attendre capture)
```

### 12 — Contacter l’hôte (redirection)

- Labels : `sprint-1` `page:propriete` `page:messagerie` — M6

```md
## Story
En tant que visiteur, je veux envoyer un message à l’hôte.

## Critères d’acceptation
- [ ] Bouton **« Envoyer un message »** accessible
- [ ] Redirige vers la page messagerie
- [ ] Sprint 1 : la page d’arrivée peut être **minimale** (l’envoi réel = sprint 2)
```

### 13 — Sitemap + Schema.org + Lighthouse

- Labels : `sprint-1` `seo` `tech` — M7

```md
## Story
En tant que Kasa, je veux un site trouvable et performant.

## Critères d’acceptation
- [ ] Sitemap
- [ ] SSR autant que possible
- [ ] Microdonnées Schema.org + meta
- [ ] Lighthouse **4 verts**
```

### 14 — Accessibilité WCAG 2.1 AA

- Labels : `sprint-1` `a11y` — M7

```md
## Story
En tant que visiteur, je veux un site utilisable (clavier, lecteur d’écran, contraste).

## Critères d’acceptation
- [ ] WAVE et/ou Lighthouse a11y sans erreur bloquante
- [ ] Contraste tokens Figma vérifié
```

### 15 — Documentation (README + JSDoc ou Storybook)

- Labels : `sprint-1` `tech` — M7

```md
## Story
En tant qu’Ingrid (reprise du projet), je veux savoir lancer et comprendre le code.

## Critères d’acceptation
- [ ] README : front + back local, `.env.example`
- [ ] JSDoc et/ou Storybook
```

### 16 — Déploiement

- Labels : `sprint-1` `tech` — M8

```md
## Story
En tant que Laura, je veux voir l’app en ligne (question de soutenance).

## Critères d’acceptation
- [ ] Front déployé (ex. Vercel) **ou** procédure locale ultra claire
- [ ] Stratégie API (back déployé ou doc localhost)
- [ ] Pas d’URL `localhost` oubliée en prod
```

### 17 — Prépa soutenance

- Labels : `sprint-1` `tech` — M8 — Due : **27 sept. 2026**

```md
## Story
En tant que Matthieu, je veux une démo de 15 min (±5).

## Critères d’acceptation
- [ ] Démo : accueil → fiche (1 image et N images) → favoris + reload → login
- [ ] Captures Lighthouse / WAVE
- [ ] Oral chronométré 10–20 min (cible 15)
```

---

## Issues sprint 2 (créer avec label `sprint-2`, milestone Sprint 2)

Ne pas commencer tant que le sprint 1 n’est pas soutenable.

| # | Titre | AC (résumé) |
| --- | --- | --- |
| 18 | S’inscrire | Formulaire + validation + RGPD ; mail de confirmation selon ce que l’API fait vraiment |
| 19 | Page Favoris | Liste + retrait ; persistants |
| 20 | Envoyer un message | Champ + Envoyer + historique ; **pas de push** sur le back OC |
| 21 | Ajouter une propriété | Champs obligatoires + validation accessibles |
| 22 | Ajouter des photos | « + Ajouter une image » + preview + limites |
| 23 | Sélectionner des équipements | Checkboxes, liste prédéfinie, persistés |

---

## Commandes (rappel agent)

```bash
gh label create sprint-1 --color E8772E
# …autres labels

gh milestone create "M1 — Init + API" --due 2026-09-11

gh issue create --title "[S1] 01 — Initialiser Next.js (App Router)" --label sprint-1,tech --milestone "M1 — Init + API" --body-file ...

gh project create --title "Kasa" --owner USER
gh project item-add PROJECT_ID --url ISSUE_URL
```

Corps : reprendre les blocs `## Critères d’acceptation` de ce fichier. Ne pas inventer d’autres stories.
