"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/auth-context";
import {
  isFavoriteId,
  readFavoriteIdsFromStorage,
  toggleFavoriteId,
  writeFavoriteIdsToStorage,
} from "@/lib/favorites";
import {
  FAVORITES_STORAGE_KEY,
  FavoriteIdsSchema,
  type FavoriteIds,
} from "@/schemas/favorites-schema";

type FavoritesContextType = {
  favoriteIds: FavoriteIds;
  /** `false` tant que session / storage n’a pas été lu (évite un écart SSR). */
  isReady: boolean;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => void;
};

const EMPTY_FAVORITE_IDS: FavoriteIds = [];

/** Fallback si hors provider (navigation RSC / HMR) — évite un crash intermittent. */
const FALLBACK_FAVORITES: FavoritesContextType = {
  favoriteIds: EMPTY_FAVORITE_IDS,
  isReady: false,
  isFavorite: () => false,
  toggleFavorite: () => {},
};

const FavoritesContext = createContext<FavoritesContextType>(FALLBACK_FAVORITES);

const FAVORITES_CHANGE_EVENT = "kasa:favorites-change";

let snapshotRaw: string | null | undefined = undefined;
let snapshotIds: FavoriteIds = EMPTY_FAVORITE_IDS;

function getClientFavoriteIds(): FavoriteIds {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw === snapshotRaw) {
      return snapshotIds;
    }
    snapshotRaw = raw;
    snapshotIds = readFavoriteIdsFromStorage();
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
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === FAVORITES_STORAGE_KEY) {
      onStoreChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);
  };
}

function persistLocalFavorites(ids: FavoriteIds) {
  writeFavoriteIdsToStorage(ids);
  snapshotRaw = ids.length === 0 ? null : JSON.stringify(ids);
  snapshotIds = ids.length === 0 ? EMPTY_FAVORITE_IDS : ids;
  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
}

function extractFavoriteIds(payload: unknown): FavoriteIds {
  if (!Array.isArray(payload)) {
    return EMPTY_FAVORITE_IDS;
  }
  const ids = payload
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }
      if (
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof (item as { id: unknown }).id === "string"
      ) {
        return (item as { id: string }).id;
      }
      return null;
    })
    .filter((id): id is string => id !== null);
  const parsed = FavoriteIdsSchema.safeParse(ids);
  return parsed.success ? parsed.data : EMPTY_FAVORITE_IDS;
}

/**
 * Favoris : visiteur = `localStorage` ; connecté = API (`/api/favorites`).
 * Le filtre « Vos favoris » lit uniquement ces ids — jamais ceux de l’URL.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { authUser, isReady: isAuthReady } = useAuth();
  const authUserId = authUser?.id ?? null;
  const localFavoriteIds = useSyncExternalStore(
    subscribeToFavorites,
    getClientFavoriteIds,
    getServerFavoriteIds,
  );
  const [authFavoriteIds, setAuthFavoriteIds] =
    useState<FavoriteIds>(EMPTY_FAVORITE_IDS);
  const [authFavoritesReady, setAuthFavoritesReady] = useState(false);
  const [loadedAuthUserId, setLoadedAuthUserId] = useState<number | null>(
    null,
  );

  // Changement de session (login / logout / autre compte) : reset hors effect
  // pour éviter `setState` synchrone dans `useEffect` (lint react-hooks).
  if (authUserId !== loadedAuthUserId) {
    setLoadedAuthUserId(authUserId);
    setAuthFavoriteIds(EMPTY_FAVORITE_IDS);
    // Visiteur : pas de fetch API — ready immédiat. Connecté : attend le fetch.
    setAuthFavoritesReady(authUserId === null);
  }

  useEffect(() => {
    if (!isAuthReady || authUserId === null) {
      return;
    }

    let cancelled = false;

    async function loadAuthFavorites() {
      try {
        const response = await fetch("/api/favorites", {
          credentials: "include",
        });
        if (!response.ok) {
          if (!cancelled) {
            setAuthFavoriteIds(EMPTY_FAVORITE_IDS);
            setAuthFavoritesReady(true);
          }
          return;
        }
        const body: unknown = await response.json();
        const list =
          typeof body === "object" &&
          body !== null &&
          "favorites" in body &&
          Array.isArray((body as { favorites: unknown }).favorites)
            ? (body as { favorites: unknown[] }).favorites
            : body;
        if (!cancelled) {
          setAuthFavoriteIds(extractFavoriteIds(list));
          setAuthFavoritesReady(true);
        }
      } catch {
        if (!cancelled) {
          setAuthFavoriteIds(EMPTY_FAVORITE_IDS);
          setAuthFavoritesReady(true);
        }
      }
    }

    void loadAuthFavorites();
    return () => {
      cancelled = true;
    };
  }, [authUserId, isAuthReady]);

  const favoriteIds = !isAuthReady
    ? EMPTY_FAVORITE_IDS
    : authUser
      ? authFavoriteIds
      : localFavoriteIds;

  const isReady = isAuthReady && (!authUser || authFavoritesReady);


  const isFavorite = useCallback(
    (propertyId: string) => isFavoriteId(favoriteIds, propertyId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    (propertyId: string) => {
      if (!propertyId || !isReady) {
        return;
      }

      if (!authUser) {
        persistLocalFavorites(toggleFavoriteId(localFavoriteIds, propertyId));
        return;
      }

      const previous = authFavoriteIds;
      const removing = isFavoriteId(previous, propertyId);
      const next = toggleFavoriteId(previous, propertyId);
      setAuthFavoriteIds(next);

      void (async () => {
        try {
          const response = await fetch(
            `/api/favorites/${encodeURIComponent(propertyId)}`,
            {
              method: removing ? "DELETE" : "POST",
              credentials: "include",
            },
          );
          if (!response.ok) {
            setAuthFavoriteIds(previous);
          }
        } catch {
          setAuthFavoriteIds(previous);
        }
      })();
    },
    [authFavoriteIds, authUser, isReady, localFavoriteIds],
  );

  const value = useMemo(
    () => ({ favoriteIds, isReady, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, isReady, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/** Accès au contexte favoris. À n’utiliser que sous {@link FavoritesProvider}. */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  // Hors provider (navigation RSC / Fast Refresh / double instance de module) :
  // on retombe sur FALLBACK_FAVORITES au lieu de throw → plus de crash aléatoire.
  if (process.env.NODE_ENV === "development" && context === FALLBACK_FAVORITES) {
    console.warn(
      "[favorites] useFavorites hors FavoritesProvider — fallback temporaire",
    );
  }
  return context;
}
