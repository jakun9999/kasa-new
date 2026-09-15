import { NextResponse } from "next/server";
import { AuthUserSchema } from "@/schemas/auth-user-schema";
import { fetchServer, requireApiSession, unauthorizedResponse } from "@/lib/api-server";
import { decodeJwtPayload, getJwtUserId } from "@/lib/jwt";

/**
 * Profil de session : lit le JWT HttpOnly, puis `GET /api/users/:id`.
 * Remplace l’ancien cookie `user_data` (lisible en JS).
 */
export async function GET() {
  const session = await requireApiSession();
  if (session.response) {
    return session.response;
  }

  const userId = getJwtUserId(session.token);
  if (userId === undefined) {
    return unauthorizedResponse();
  }

  const payload = decodeJwtPayload(session.token);
  const backendResponse = await fetchServer(`/api/users/${userId}`);

  if (!backendResponse.ok) {
    return unauthorizedResponse();
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
