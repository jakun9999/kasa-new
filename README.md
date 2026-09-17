# Kasa (front)

Refonte front-end du site **Kasa** (location entre particuliers) — projet OpenClassrooms.

Stack : **Next.js (App Router) + React + TypeScript + Tailwind v4**, branché sur l’API Express officielle.

| Ressource                                | Lien                                                           |
| ---------------------------------------- | -------------------------------------------------------------- |
| Backend officiel (lecture / clone local) | https://github.com/OpenClassrooms-Student-Center/dev-react-P12 |
| Maquette Figma `KASA-NEW`                | https://www.figma.com/design/CaJq57v4Wb29KMa7ZW5PXv/KASA-NEW   |
| Doc technique générée (TypeDoc)          | dossier [`docs/`](./docs/) après `npm run docs`                |

> Ne **pas** pousser de commits vers le dépôt backend OpenClassrooms. Front = ce repo uniquement.

---

## Prérequis

- **Node.js** 20+ recommandé (18+ minimum)
- **npm** (lockfile `package-lock.json` fourni)
- Backend Kasa lancé en local (voir ci-dessous)
- Compte / token inutiles pour lister les logements (endpoints publics)

---

## 1. Récupérer les sources

```bash
git clone <url-de-ce-repo>
cd kasa-new
```

---

## 2. Backend (API Express)

Clone **à part** (dossier frère recommandé) :

```bash
git clone https://github.com/OpenClassrooms-Student-Center/dev-react-P12.git
cd dev-react-P12
npm install
npm start
```

- API par défaut : `http://localhost:3000` (variable `PORT` du backend)
- OpenAPI : `http://localhost:3000/docs.html`

Si la base est vide, le seed part de `data/properties.json`. Reset : arrêter le serveur, supprimer `data/kasa.sqlite3`, relancer.

---

## 3. Variables d’environnement (front)

```bash
cp .env.example .env.local
```

Édite `.env.local` :

| Variable               | Rôle                                                | Exemple local                     |
| ---------------------- | --------------------------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_API_URL`  | URL du backend Express                              | `http://localhost:3000`           |
| `NEXT_PUBLIC_SITE_URL` | URL publique du front (sitemap, canonical, JSON-LD) | `http://localhost:8080`           |
| `JWT_SECRET`           | **Doit être identique** au secret JWT du backend    | copie depuis le `.env` du backend |

Le front tourne sur le **port 8080** (`npm run dev` / `start`) pour ne pas collisionner avec l’API.

---

## 4. Installer & lancer le front (dev)

```bash
npm install
npm run dev
```

Ouvre [http://localhost:8080](http://localhost:8080).

Hot reload webpack. Les skeletons de démo (2 s) n’apparaissent qu’en `NODE_ENV=development`.

---

## 5. Tests (Vitest)

```bash
npm test              # une passe (CI / avant commit)
npm run test:watch    # mode watch
```

Config : `vitest.config.mts` + `vitest.setup.ts`.

| Cible           | Fichier                                          | Couverture brief                             |
| --------------- | ------------------------------------------------ | -------------------------------------------- |
| Carrousel       | `src/components/ui/carousel/carousel.test.tsx`   | next / prev / wrap / 1 image / clavier       |
| Favoris UI      | `src/components/ui/cards/property-card.test.tsx` | cœur, `localStorage`, pas de nav sur clic ❤️ |
| Helpers favoris | `src/lib/favorites.test.ts`                      | toggle, filtre, `favoris=1`, storage         |

En test, `next/image` est mocké en `<img>` (pas de runtime Next dans jsdom).

---

## 6. Documentation TypeDoc

Le cahier des charges demande **JSDoc et/ou Storybook**. Ici : **commentaires TSDoc + TypeDoc** (équivalent JSDoc en TypeScript).

```bash
npm run docs          # génère le site HTML dans ./docs
npm run docs:watch    # régénère à chaque changement
```

Ouvre `docs/index.html` dans le navigateur.

Config : `typedoc.json` (entrée `src/lib`, `context`, `schemas`, `components`, `app`).

Fiches orales (hors TypeDoc, dossier local) : voir aussi le dossier `soutenance/` s’il est présent sur ta machine (souvent gitignoré).

---

## 7. Build & preview « prod » locale

```bash
npm run build
npm run start
```

Toujours sur le port **8080**. Lighthouse / démo soutenance : préférer **ce mode** (pas `next dev`).

---

## 8. Mise en production — quoi modifier ?

Checklist avant déploiement (Vercel, Node host, etc.) :

| Fichier / réglage          | Action                                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.env` / secrets hébergeur | `NEXT_PUBLIC_API_URL` → URL **publique** de l’API (HTTPS)                                                                                           |
|                            | `NEXT_PUBLIC_SITE_URL` → URL **finale** du front (ex. `https://kasa.ton-domaine.fr`)                                                                |
|                            | `JWT_SECRET` → **même valeur** que le backend (secret serveur, jamais exposé au client)                                                             |
| `next.config.ts`           | `images.remotePatterns` : hosts des photos (S3 OC + host API prod)                                                                                  |
| Backend                    | CORS / cookies : le cookie `token` est HttpOnly sur le **domaine du front** (BFF Next) ; l’API Express reste appelée côté serveur via `fetchServer` |
| `src/lib/site-url.ts`      | Fallback localhost si env manquante — en prod, **toujours** définir `NEXT_PUBLIC_SITE_URL`                                                          |
| Sitemap                    | Régénéré via `src/app/sitemap.ts` ; vérifier `/sitemap.xml` après deploy                                                                            |
| Ne pas committer           | `.env`, `.env.local`, secrets, `data/*.sqlite` du backend                                                                                           |

Pas de fichier « config prod » séparé : les `NEXT_PUBLIC_*` et secrets d’hébergement suffisent.

---

## Architecture rapide

```
src/
  app/           # routes App Router (pages serveur + BFF /api/*)
  components/    # UI (îlots "use client" si besoin)
  context/       # Auth + Favoris
  lib/           # session, JWT, favoris, SEO, CSRF, rate-limit…
  schemas/       # Zod (contrats API / formulaires)
```

- **SSR autant que possible** : pages liste / fiche = Server Components + fetch.
- **Client** : header, favoris, carrousel, login, messagerie (voir inventaire soutenance).
- **Favoris sprint 1** : `localStorage` (`kasa:favorites`) pour le visiteur ; API si connecté.
- **SEO** : `generateMetadata`, JSON-LD `Accommodation`, `app/sitemap.ts`.

---

## Scripts npm

| Script               | Description               |
| -------------------- | ------------------------- |
| `npm run dev`        | Dev server :8080          |
| `npm run build`      | Build production          |
| `npm run start`      | Sert le build :8080       |
| `npm test`           | Vitest une passe          |
| `npm run test:watch` | Vitest watch              |
| `npm run lint`       | ESLint                    |
| `npm run docs`       | Génère TypeDoc → `./docs` |

---

## Qualité / soutenance

- Accessibilité : cible WCAG 2.1 AA (écarts Figma contrastes assumés — voir notes soutenance)
- Lighthouse : mesurer sur `npm run build && npm run start`
- README + TypeDoc = livrable documentation (pas Storybook)
