import {
  FAVORITES_STORAGE_KEY,
  FavoriteIdsSchema,
  type FavoriteIds,
} from "@/schemas/favorites-schema";

const EMPTY: FavoriteIds = [];

/** Ajoute ou retire un id (idempotent, sans doublon). */
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

export function isFavoriteId(
  ids: readonly string[],
  propertyId: string,
): boolean {
  return ids.includes(propertyId);
}

/**
 * Seul `favoris=1` active la vue. Toute autre valeur (liste d’ids, `true`, etc.)
 * est ignorée — on ne fait jamais confiance à des ids passés dans l’URL.
 */
export function parseShowFavoritesOnly(
  value: string | string[] | undefined,
): boolean {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "1";
}

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
