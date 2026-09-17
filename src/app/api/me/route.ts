import { NextResponse } from "next/server";
import { AuthUserSchema } from "@/schemas/auth-user-schema";
import { fetchServer, getSessionToken } from "@/lib/api-server";
import { decodeJwtPayload, getJwtUserId } from "@/lib/jwt";

/**
 * Sonde de session (hydratation client) : toujours **200**.
 * - connecté → `{ success: true, user }`
 * - visiteur / JWT absent ou invalide → `{ success: true, user: null }`
 *
 * Évite un 401 « bruit » dans la console / Lighthouse à chaque chargement anonyme.
 * Les routes protégées (`/api/favorites`, etc.) gardent le 401.
 */
export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ success: true, user: null });
  }

  const userId = getJwtUserId(token);
  if (userId === undefined) {
    return NextResponse.json({ success: true, user: null });
  }

  const payload = decodeJwtPayload(token);
  const backendResponse = await fetchServer(`/api/users/${userId}`);

  if (!backendResponse.ok) {
    return NextResponse.json({ success: true, user: null });
  }

  const row: unknown = await backendResponse.json();
  if (typeof row !== "object" || row === null) {
    return NextResponse.json(
      { success: false, message: "Profil utilisateur invalide" },
      { status: 502 },
    );
  }

  const record = row as Record<string, unknown>;
  const parsed = AuthUserSchema.safeParse({
    id: record.id,
    name: record.name,
    role: record.role,
    picture: typeof record.picture === "string" ? record.picture : "",
    email:
      typeof payload?.email === "string"
        ? payload.email
        : typeof record.email === "string"
          ? record.email
          : undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Profil utilisateur invalide" },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true, user: parsed.data });
}
