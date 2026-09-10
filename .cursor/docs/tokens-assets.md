# Assets Figma exportés (lecture seule)

Dossier : `figma-export/`. Ne pas modifier Figma. Ne pas retracer les SVG.

## Logos — `figma-export/logos/`

| Fichier | Usage |
| --- | --- |
| `kasa_logo_picto.svg` | Picto maison (47×54) |
| `kasa_logo_name.svg` | Wordmark Kasa + picto (163×58) |

Les dégradés internes passent encore par l’ancien `#FF6060`. **Utiliser les fichiers tels quels.**

## Icônes — `figma-export/icons/`

Défaut export : `fill` noir / `#0D0D0D`. Dans l’UI, colorier via CSS (`currentColor`) selon le fond (Blanc sur Main red / Dark orange, Gris dark ou Noir sur fond clair).

| Fichier | ViewBox | Usage probable |
| --- | --- | --- |
| `back_icon.svg` | 16×16 | Retour |
| `close_icon.svg` | 16×16 | Fermer |
| `delete_icon.svg` | 16×16 | Supprimer |
| `favori_icon.svg` | 16×16 | Favoris (cœur, fill blanc + contour `#0D0D0D`) |
| `localisation_icon.svg` | 16×16 | Localisation fiche / card |
| `menu_icon.svg` | 16×16 | Menu burger |
| `message_icon.svg` | 16×16 | Messagerie ; icône d’exemple du CTA Figma |
| `plus_icon.svg` | 16×16 | Ajouter |
| `send_icon.svg` | 16×16 | Envoi message |
| `checkbox_checked_icon.svg` | 12×12 | Checkbox on — fill Noir `#0D0D0D`, stroke `#565656` |
| `checkbox_unchecked_icon.svg` | 12×12 | Checkbox off — stroke `#565656` |

Checkboxes : radius ~1,5px, **12px**, pas 16px.

États favori plein vs vide : un seul SVG (cœur). Vérifier sur les frames s’il existe un second état ; ne pas inventer un fill Main red sans maquette.

## Screenshots composants — `figma-export/screenshots/components/`

Voir `tokens-boutons.md`.

Autres composants / pages : **volontairement pas encore** — au fil de l’eau avec Matthieu (maîtrise du code pour la soutenance).
