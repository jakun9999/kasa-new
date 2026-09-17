import { NextResponse } from "next/server";
import { parseAuthUser } from "@/schemas/auth-user-schema";
import { LoginSchema } from "@/schemas/login-schema";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/api-server";
import { RATE_LIMITS, enforceRateLimit, getClientIp } from "@/lib/rate-limit";

/** Backend officiel : `{ token, user }`. Variante wrappée : `{ data: { token, user } }`. */
function unwrapLoginPayload(result: unknown): {
  token: string | undefined;
  user: unknown;
} {
  if (typeof result !== "object" || result === null) {
    return { token: undefined, user: undefined };
  }
  const record = result as Record<string, unknown>;
  if (typeof record.token === "string") {
    return { token: record.token, user: record.user };
  }
  const data = record.data;
  if (typeof data === "object" && data !== null) {
    const nested = data as Record<string, unknown>;
    if (typeof nested.token === "string") {
      return { token: nested.token, user: nested.user };
    }
  }
  return { token: undefined, user: undefined };
}

/** Messages FR uniquement — on ne renvoie jamais le texte brut du backend (souvent EN). */
function loginErrorMessage(status: number): string {
  if (status === 401) {
    return "E-mail ou mot de passe incorrect.";
  }
  if (status === 400) {
    return "Données d'identification incorrectes.";
  }
  if (status === 429) {
    return "Trop de tentatives. Réessayez plus tard.";
  }
  if (status >= 500) {
    return "Service indisponible. Réessayez plus tard.";
  }
  return "Impossible de se connecter. Réessayez.";
}

/**
 * Authentifie via le backend et pose uniquement `token` (JWT HttpOnly).
 * Le profil est renvoyé dans le JSON ; au refresh, `GET /api/me` le relit.
 */
export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(
      `login:${getClientIp(request)}`,
      RATE_LIMITS.login,
      "tentatives de connexion",
    );
    if (limited) return limited;

    const body = await request.json();

    const authDataValidation = LoginSchema.safeParse(body);

    if (!authDataValidation.success) {
      return NextResponse.json(
        { message: loginErrorMessage(400) },
        { status: 400 },
      );
    }

    const { email, password } = authDataValidation.data;
    const API_URL =
      process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      return NextResponse.json(
        { message: loginErrorMessage(500) },
        { status: 500 },
      );
    }

    const backendResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let result: unknown;
    try {
      result = await backendResponse.json();
    } catch {
      return NextResponse.json(
        { message: loginErrorMessage(502) },
        { status: 502 },
      );
    }

    if (!backendResponse.ok) {
      // Log serveur uniquement — jamais renvoyé au client.
      console.error("Login: échec backend", {
        status: backendResponse.status,
        body: result,
      });
      return NextResponse.json(
        { message: loginErrorMessage(backendResponse.status) },
        { status: backendResponse.status },
      );
    }

    const { token, user } = unwrapLoginPayload(result);
    const safeAuthUser = parseAuthUser(user);

    if (!token || !safeAuthUser) {
      console.error("Login: profil ou token backend invalide", { user });
      return NextResponse.json(
        { message: loginErrorMessage(502) },
        { status: 502 },
      );
    }

    // Poser le cookie sur la **réponse** (plus fiable derrière Passenger/proxy
    // que `cookies().set` seul — sinon la messagerie ne voit pas la session).
    const forwardedProto = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const secure =
      forwardedProto === "https" || process.env.NODE_ENV === "production";

    const response = NextResponse.json({
      success: true,
      user: safeAuthUser,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    // Nettoie l’ancien cookie non HttpOnly s’il existe encore.
    response.cookies.set("user_data", "", {
      httpOnly: false,
      secure,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login: erreur inattendue", error);
    return NextResponse.json(
      { message: loginErrorMessage(500) },
      { status: 500 },
    );
  }
}
