import { NextResponse, type NextRequest } from "next/server";

/**
 * Déconnexion : expire `token` (HttpOnly). N’invalide pas le JWT côté backend
 * (pas d’endpoint de révocation). Idempotent si déjà déconnecté.
 * Les favoris visiteur sont vidés côté client (`localStorage`) dans `logout()`.
 */
export async function POST(request: NextRequest) {
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const secure =
    forwardedProto === "https" || process.env.NODE_ENV === "production";

  const response = NextResponse.json({ success: true });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("user_data", "", {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
