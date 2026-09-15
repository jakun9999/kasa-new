import { z } from "zod";

/** Clé `localStorage` du brief OC (visiteur non authentifié). */
export const FAVORITES_STORAGE_KEY = "kasa:favorites";

/** IDs de logements favoris (`Property.id`). Dédupliqués à la lecture. */
export const FavoriteIdsSchema = z
  .array(z.string().min(1))
  .transform((ids) => [...new Set(ids)]);

export type FavoriteIds = z.infer<typeof FavoriteIdsSchema>;
