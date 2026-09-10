# Product Backlog Kasa (Notion)

Source : capture « Backlog complet », 9 septembre 2026.  
Onglets Notion : Backlog complet | **Sprint 1 (obligatoire)** | **Sprint 2 (optionnel)**.

Ne pas modifier Notion. Ce fichier est la synthèse pour les agents.

## Sprint 1 — obligatoire

| ID | En tant que… | Critères | Contraintes | Page |
| --- | --- | --- | --- | --- |
| Afficher les logements | visiteur, voir la liste (images, titres, **prix**) | Cards : image, titre, prix, bouton ❤️ | `alt` sur les images | Accueil |
| Ajouter aux favoris | visiteur, cliquer ❤️ | Cœur rouge ; le bien apparaît dans **« Vos favoris »** (même session) ; **tests unitaires** | **Context + localStorage** | Accueil |
| Naviguer vers un logement | visiteur, cliquer une card | Redirection vers la fiche | Lien fonctionnel | Accueil |
| Afficher les détails d’une propriété | visiteur, voir photos, description, équipements, prix | Carrousel animé, **boucle** premier↔dernier, **hauteur fixe**, image centrée/croppée ; **collapse** cliquables animés ; **tests unitaires carrousel** | Carrousel **clavier** ; **pas de flèches si 1 image** | Propriété |
| Contacter l’hôte | visiteur, écrire à l’hôte | Bouton **« Envoyer un message »** → page messagerie | Bouton accessible | Propriété |
| Se connecter | utilisateur, email + mot de passe | Formulaire OK ; message d’erreur si identifiants invalides | Mot de passe géré de façon sécurisée | Connexion |

## Sprint 2 — optionnel (après sprint 1 soutenable)

| ID | En tant que… | Critères | Contraintes | Page |
| --- | --- | --- | --- | --- |
| Ajouter une propriété | hôte, formulaire | Champs obligatoires : titre, description, lieu, prix, photos, équipements ; validation | Champs accessibles + validés | Ajout de propriété |
| Ajouter des photos | hôte, upload | Bouton « + Ajouter une image » ; preview | Limites taille / nombre | Ajout de propriété |
| Sélectionner des équipements | hôte, cocher | Checkboxes ; persistés avec le bien | Liste prédéfinie | Ajout de propriété |
| S’inscrire | nouveau, créer un compte | Formulaire + validation ; **e-mail de confirmation** | **RGPD** | Connexion |
| Afficher les favoris | visiteur, voir ses favoris | Liste ; pouvoir retirer un favori | Stockage persistant | **Favoris** (page dédiée) |
| Envoyer un message | visiteur, écrire à l’hôte | Champ texte + « Envoyer » | Historique visible ; **modif back-end requise** | Messagerie |

## Recoupement CDC (étapes / checklist)

Toujours dus pour l’évaluation, même s’ils ne sont pas des lignes du tableau Notion : Next.js App Router, slug, `next/image`, skeleton, sitemap, Schema.org, Lighthouse vert, WCAG 2.1 AA, JSDoc ou Storybook, README, responsive.

## Tensions à connaître (ne pas « corriger » Notion)

1. **Login = sprint 1** dans Notion, absent des étapes 1–9 du CDC. Suivre **Notion** (sprint obligatoire).
2. **Contacter l’hôte = sprint 1** = bouton vers la messagerie. **Envoyer un message = sprint 2**. En sprint 1 : bouton + route, page messagerie peut être minimale.
3. **Ajouter aux favoris = sprint 1** (❤️ + « Vos favoris » sur l’accueil, Context + localStorage). **Page Favoris dédiée = sprint 2**.
4. Cards : le backlog exige le **prix** (l’API le fournit).
5. Messagerie sprint 2 : « modification back-end ». **Ne pas pousser** sur le repo OpenClassrooms. Fork/clone local uniquement, ou rester en sprint 1 sans vrai envoi.
6. Inscription sprint 2 : e-mail de confirmation — l’API locale n’envoie probablement pas de vrai mail ; documenter le comportement réel.

## Ordre de build (quand Matthieu le demandera)

Aligné étapes CDC + backlog, **une brique à la fois** : init → API → tokens/layout → cards accueil → fiche (carrousel + collapse) → favoris Context/localStorage → login → bouton message → SEO/a11y/docs.
