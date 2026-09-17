/**
 * Helpers favoris (brief sprint 1 = `localStorage` pour le visiteur).
 *
 * @remarks
 * L’URL `/?favoris=1` active seulement le **mode d’affichage**.
 * Les ids viennent du Context / storage — jamais d’une liste d’ids dans la query
 * (sinon un lien partagé pourrait falsifier les favoris).
 */

import {
  FAVORITES_STORAGE_KEY,
  FavoriteIdsSchema,
  type FavoriteIds,
} from "@/schemas/favorites-schema";

const EMPTY: FavoriteIds = [];

/**
 * Ajoute ou retire un id (idempotent, sans doublon).
 * @returns Nouvelle liste validée par Zod ({@link FavoriteIdsSchema}).
 */
export function toggleFavoriteId(
  ids: readonly string[],
  propertyId: string,
): FavoriteIds {
  if (!propertyId) {
    return FavoriteIdsSchema.parse([...ids]);
  }
  if (ids.includes(propertyId)) {
    return FavoriteIdsSchema.parse(ids.filter((id) => id !== propertyId));
  }
  return FavoriteIdsSchema.parse([...ids, propertyId]);
}

/** `true` si `propertyId` est déjà dans la liste. */
export function isFavoriteId(
  ids: readonly string[],
  propertyId: string,
): boolean {
  return ids.includes(propertyId);
}

/**
 * Seul `favoris=1` active la vue « Vos favoris ».
 * Toute autre valeur (`true`, liste d’ids, etc.) est ignorée.
 */
export function parseShowFavoritesOnly(
  value: string | string[] | undefined,
): boolean {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "1";
}

/**
 * Filtre la grille accueil sur les ids favoris (Context).
 * Liste vide de favoris → aucune card (pas « tout afficher »).
 */
export function filterPropertiesByFavoriteIds<T extends { id: string }>(
  properties: readonly T[],
  favoriteIds: readonly string[],
): T[] {
  if (favoriteIds.length === 0) {
    return [];
  }
  const set = new Set(favoriteIds);
  return properties.filter((property) => set.has(property.id));
}

/**
 * Lit `localStorage` (`kasa:favorites`). JSON invalide → liste vide (fail soft).
 * @param storage - Injecté en tests ; défaut = `localStorage` navigateur.
 */
export function readFavoriteIdsFromStorage(
  storage: Pick<Storage, "getItem"> = localStorage,
): FavoriteIds {
  try {
    const raw = storage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return EMPTY;
    }
    const parsed = FavoriteIdsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY;
  } catch {
    return EMPTY;
  }
}

/**
 * Persiste les ids. Liste vide → `removeItem` (pas de `[]` fantôme).
 * @param storage - Injecté en tests ; défaut = `localStorage` navigateur.
 */
export function writeFavoriteIdsToStorage(
  ids: FavoriteIds,
  storage: Pick<Storage, "setItem" | "removeItem"> = localStorage,
): void {
  if (ids.length === 0) {
    storage.removeItem(FAVORITES_STORAGE_KEY);
    return;
  }
  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
}
