import { NextResponse } from "next/server";
import {
  fetchServer,
  requireApiSession,
  unauthorizedResponse,
} from "@/lib/api-server";
import { getJwtUserId } from "@/lib/jwt";
import { FavoriteIdsSchema } from "@/schemas/favorites-schema";

/**
 * Liste des favoris de l’utilisateur connecté (ids uniquement pour le Context).
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

  const backendResponse = await fetchServer(`/api/users/${userId}/favorites`);
  if (!backendResponse.ok) {
    return NextResponse.json(
      { success: false, message: "Impossible de charger les favoris." },
      { status: backendResponse.status === 401 ? 401 : 502 },
    );
  }

  const payload: unknown = await backendResponse.json();
  if (!Array.isArray(payload)) {
    return NextResponse.json(
      { success: false, message: "Réponse favoris invalide." },
      { status: 502 },
    );
  }

  const ids = payload
    .map((item) =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      typeof (item as { id: unknown }).id === "string"
        ? (item as { id: string }).id
        : null,
    )
    .filter((id): id is string => id !== null);

  const parsed = FavoriteIdsSchema.safeParse(ids);
  return NextResponse.json({
    success: true,
    favorites: parsed.success ? parsed.data : [],
  });
}
