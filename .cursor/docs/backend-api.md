# Backend Kasa (lecture seule)

Dépôt officiel : [OpenClassrooms-Student-Center/dev-react-P12](https://github.com/OpenClassrooms-Student-Center/dev-react-P12)

**Ne pas forker pour y pousser le front. Ne pas modifier le remote officiel.** Clone local uniquement, éventuellement un fork personnel si besoin de notes, sans PR vers OpenClassrooms.

## Stack

- Express 5, SQLite (`data/kasa.sqlite3`), JWT, OpenAPI
- Node 18+ recommandé
- Seed depuis `data/properties.json` si la base est vide
- Slugs générés automatiquement, uniques

## Lancement (local)

```bash
git clone https://github.com/OpenClassrooms-Student-Center/dev-react-P12.git
cd dev-react-P12
npm install
npm start
```

- API : `http://localhost:3000` (variable `PORT`)
- Docs : `http://localhost:3000/docs.html`
- Spec : `http://localhost:3000/openapi.json`

Le front Next.js devra utiliser **un autre port** (ex. 3001) pour éviter le conflit. Variable typique : `NEXT_PUBLIC_API_URL=http://localhost:3000`.

Reset DB : arrêter le serveur, supprimer `data/kasa.sqlite3`, relancer.

## Montage des routes

- `/` info API
- `/auth/*` authentification
- `/api/*` ressources métier

Auth : header `Authorization: Bearer <token>`. Rôles : `client`, `owner`, `admin`.

## Endpoints utiles au sprint 1

| Méthode | Chemin | Auth | Usage |
| --- | --- | --- | --- |
| GET | `/api/properties` | non | Liste |
| GET | `/api/properties/:id` | non | Détail (id **ou** slug selon OpenAPI — vérifier en local) |

Le front sprint 1 n’a **pas besoin** d’auth pour lister et afficher.

## Endpoints plutôt sprint 2 / hors prio

| Méthode | Chemin | Auth |
| --- | --- | --- |
| POST | `/auth/register` | non (`role` client ou owner, défaut client) |
| POST | `/auth/login` | non → JWT |
| POST | `/auth/request-reset`, `/auth/reset-password` | non |
| POST / PATCH / DELETE | `/api/properties` | owner ou admin |
| GET / POST / PATCH | `/api/users` | admin ou self |
| GET / POST | `/api/properties/:id/ratings` | notes |
| POST / DELETE | `/api/properties/:id/favorite` | utilisateur connecté |
| GET | `/api/users/:id/favorites` | self ou admin |
| POST | `/api/uploads/image` | owner ou admin |
| DELETE | `/api/uploads/images` | owner ou admin |

Images uploadées servies sous `/uploads/...`.

## Forme des propriétés (seed)

Champs observés dans `data/properties.json` (le JSON de **réponse API** peut être légèrement différent après seed — **vérifier OpenAPI et un GET réel**) :

- `id` (string)
- `title`, `cover`, `pictures[]`
- `description`
- `host` : `{ name, picture }`
- `rating` (string numérique, ex. `"5"`)
- `location`
- `equipments[]`, `tags[]`

L’API ajoute un **slug**. Les étapes demandent d’utiliser le slug dans l’URL de détail, par ex. `/logements/[slug]`.

Certaines fiches n’ont **qu’une image** dans `pictures` : le carrousel doit alors masquer flèches / compteur selon Figma.

## CORS / images distantes

Les covers pointent vers `s3-eu-west-1.amazonaws.com/course.oc-static.com/...`. Configurer `next.config` (`images.remotePatterns`) en conséquence. Ne pas hotlinker d’autres domaines sans besoin.

## Ce que le front ne doit pas faire

- Réécrire ou « corriger » le backend officiel
- Dépendre d’un backend déployé par un autre étudiant
- Assumer que les favoris API remplacent `localStorage` en sprint 1
