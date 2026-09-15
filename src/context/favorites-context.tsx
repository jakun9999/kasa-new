"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/auth-context";
import {
  FAVORITES_STORAGE_KEY,
  FavoriteIdsSchema,
  type FavoriteIds,
} from "@/schemas/favorites-schema";

type FavoritesContextType = {
  favoriteIds: FavoriteIds;
  /** `false` tant que la session n’a pas été lue (évite un écart SSR). */
  isReady: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

/** Référence stable : `getServerSnapshot` / liste vide ne doivent pas renvoyer un nouveau `[]` à chaque appel. */
const EMPTY_FAVORITE_IDS: FavoriteIds = [];

let snapshotRaw: string | null | undefined = undefined;
let snapshotIds: FavoriteIds = EMPTY_FAVORITE_IDS;

function getClientFavoriteIds(): FavoriteIds {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw === snapshotRaw) {
      return snapshotIds;
    }
    snapshotRaw = raw;
    if (!raw) {
      snapshotIds = EMPTY_FAVORITE_IDS;
      return snapshotIds;
    }
    const parsed = FavoriteIdsSchema.safeParse(JSON.parse(raw));
    snapshotIds = parsed.success ? parsed.data : EMPTY_FAVORITE_IDS;
    return snapshotIds;
  } catch {
    snapshotRaw = null;
    snapshotIds = EMPTY_FAVORITE_IDS;
    return snapshotIds;
  }
}

function getServerFavoriteIds(): FavoriteIds {
  return EMPTY_FAVORITE_IDS;
}

function subscribeToFavorites(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

/**
 * Favoris : visiteur = `localStorage` (`kasa:favorites`) ; connecté = IDs API
 * (vide pour l’instant, le fetch viendra avec le clic cœur).
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { authUser, isReady: isAuthReady } = useAuth();
  const localFavoriteIds = useSyncExternalStore(
    subscribeToFavorites,
    getClientFavoriteIds,
    getServerFavoriteIds,
  );

  const favoriteIds =
    !isAuthReady || authUser ? EMPTY_FAVORITE_IDS : localFavoriteIds;

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isReady: isAuthReady }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

/** Accès au contexte favoris. À n’utiliser que sous {@link FavoritesProvider}. */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used in a FavoritesProvider");
  }
  return context;
}
