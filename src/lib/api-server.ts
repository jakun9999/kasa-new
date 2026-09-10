import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionJwtUsable } from "@/lib/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Durée des cookies de session (`token`, `user_data`) : **24 heures**.
 * Timeout absolu classique d’une session web (pas un « remember me » 7 jours).
 */
export const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

/** Valeur cookie `user_data` : JSON encodé (noms / e-mails / picture / role hors ASCII). */
export function encodeUserDataCookie(user: unknown): string {
  return encodeURIComponent(JSON.stringify(user));
}

/**
 * JWT de session (`cookie` `token`). `undefined` si absent, mal formé ou expiré.
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token || !(await isSessionJwtUsable(token))) {
    return undefined;
  }
  return token;
}

/** Réponse JSON 401 partagée par les routes BFF. */
export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Non authentifié" },
    { status: 401 },
  );
}

/**
 * Garde BFF : cookie `token` obligatoire. À appeler en tête de route
 * (login / register / request-reset / reset-password / properties / 
 * properties-by-id / properties ratings exclus).
 */
export async function requireApiSession(): Promise<
  { token: string; response: null } | { token: null; response: NextResponse }
> {
  const token = await getSessionToken();
  if (!token) {
    return { token: null, response: unauthorizedResponse() };
  }
  return { token, response: null };
}

type FetchServerOptions = RequestInit & {
  /**
   * `true` (défaut) : cookie `token` obligatoire, header `Authorization`.
   * `false` : appel public, pas de token (login, register, liste / détail propriétés).
   */
  auth?: boolean;
};

/**
 * `fetch` serveur pour les Server Components et le BFF.
 *
 * Auth (`auth: true`, défaut) : sans cookie `token` utilisable, 401 **sans**
 * appeler le backend. Public (`auth: false`) : le backend est appelé tel quel.
 *
 * @param endpoint - Chemin backend (ex. `"/api/users"`).
 * @param options - Options `fetch` + `auth`. Les headers sont fusionnés.
 */
export async function fetchServer(
  endpoint: string,
  options: FetchServerOptions = {},
) {
  const { auth = true, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);

  if (auth) {
    const token = await getSessionToken();
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Non authentifié" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_URL}${endpoint}`, { ...fetchOptions, headers });
}