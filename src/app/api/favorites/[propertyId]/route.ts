import { NextResponse } from "next/server";
import { fetchServer, requireApiSession } from "@/lib/api-server";

type RouteContext = {
  params: Promise<{ propertyId: string }>;
};

/**
 * Ajoute un logement aux favoris API (utilisateur connecté).
 */
export async function POST(_request: Request, context: RouteContext) {
  const session = await requireApiSession();
  if (session.response) {
    return session.response;
  }

  const { propertyId } = await context.params;
  if (!propertyId) {
    return NextResponse.json(
      { success: false, message: "Logement invalide." },
      { status: 400 },
    );
  }

  const backendResponse = await fetchServer(
    `/api/properties/${encodeURIComponent(propertyId)}/favorite`,
    { method: "POST" },
  );

  if (!backendResponse.ok) {
    return NextResponse.json(
      { success: false, message: "Impossible d'ajouter aux favoris." },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json({ success: true });
}

/**
 * Retire un logement des favoris API (utilisateur connecté).
 */
export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireApiSession();
  if (session.response) {
    return session.response;
  }

  const { propertyId } = await context.params;
  if (!propertyId) {
    return NextResponse.json(
      { success: false, message: "Logement invalide." },
      { status: 400 },
    );
  }

  const backendResponse = await fetchServer(
    `/api/properties/${encodeURIComponent(propertyId)}/favorite`,
    { method: "DELETE" },
  );

  if (!backendResponse.ok) {
    return NextResponse.json(
      { success: false, message: "Impossible de retirer des favoris." },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json({ success: true });
}
