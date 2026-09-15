"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AuthUser, AuthUserSchema } from "@/schemas/auth-user-schema";
import { FAVORITES_STORAGE_KEY } from "@/schemas/favorites-schema";

interface AuthContextType {
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
  logout: () => void;
  /** `false` tant que `GET /api/me` n’a pas répondu (évite un flash header). */
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth client. Le JWT reste en cookie HttpOnly (`token`).
 * Le profil est hydraté via `GET /api/me` (pas de cookie lisible en JS).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUserState] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const response = await fetch("/api/me", { credentials: "include" });
        if (!response.ok) {
          if (!cancelled) {
            setAuthUserState(null);
            setIsReady(true);
          }
          return;
        }
        const body: unknown = await response.json();
        const user =
          typeof body === "object" && body !== null && "user" in body
            ? (body as { user: unknown }).user
            : undefined;
        const parsed = AuthUserSchema.safeParse(user);
        if (!cancelled) {
          setAuthUserState(parsed.success ? parsed.data : null);
          setIsReady(true);
        }
      } catch {
        if (!cancelled) {
          setAuthUserState(null);
          setIsReady(true);
        }
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const setAuthUser = useCallback((next: AuthUser | null) => {
    setAuthUserState(next);
  }, []);

  /**
   * Expire le JWT, vide les favoris visiteur (`localStorage`) pour un PC partagé,
   * puis redirige vers `/login`.
   */
  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    try {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch {
      /* localStorage peut être indisponible (mode privé strict). */
    }
    setAuthUserState(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Accès au contexte auth. À n’utiliser que sous {@link AuthProvider}.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used in a AuthProvider");
  }
  return context;
}
