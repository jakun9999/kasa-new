import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseAuthUser } from "@/schemas/auth-user-schema";
import { LoginSchema } from "@/schemas/login-schema";
import { z } from "zod";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/api-server";
import { RATE_LIMITS, enforceRateLimit, getClientIp } from "@/lib/rate-limit";

function readBackendMessage(result: unknown): string | null {
  if (typeof result !== "object" || result === null) {
    return null;
  }
  const record = result as Record<string, unknown>;
  if (typeof record.error === "string") {
    return record.error;
  }
  if (typeof record.message === "string") {
    return record.message;
  }
  return null;
}

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
        {
          message: "Données d'identification incorrectes",
          errors: z.treeifyError(authDataValidation.error),
        },
        { status: 400 },
      );
    }

    const { email, password } = authDataValidation.data;
    const API_URL =
      process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      return NextResponse.json(
        { message: "Internal server error" },
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
        { message: "Réponse backend invalide" },
        { status: 502 },
      );
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message:
            readBackendMessage(result) ||
            (backendResponse.status === 401
              ? "E-mail ou mot de passe incorrect."
              : "Erreur d'authentification"),
        },
        { status: backendResponse.status },
      );
    }

    const { token, user } = unwrapLoginPayload(result);
    const safeAuthUser = parseAuthUser(user);

    if (!token || !safeAuthUser) {
      console.error("Login: profil ou token backend invalide", { user });
      return NextResponse.json(
        { message: "AuthUser profil structure sent by backend are invalid" },
        { status: 502 },
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    cookieStore.set("user_data", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: safeAuthUser,
    });
  } catch (error) {
    console.error("Login: erreur inattendue", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
