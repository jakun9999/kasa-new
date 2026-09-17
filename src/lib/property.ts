import { fetchServer } from "@/lib/api-server";
import { propertySchema, type Property } from "@/schemas/property";

/** Extrait l’id API depuis le param de route `{id}-{slug}`. */
export function propertyIdFromSlugParam(slugParam: string): string {
  return slugParam.split("-")[0] ?? slugParam;
}

/**
 * Charge un logement pour la page fiche / `generateMetadata`.
 * `null` si 404 ou erreur réseau (la page appellera `notFound()`).
 */
export async function getPropertyBySlugParam(
  slugParam: string,
): Promise<Property | null> {
  const id = propertyIdFromSlugParam(slugParam);
  const response = await fetchServer(`/api/properties/${id}`, {
    auth: false,
  });
  if (!response.ok) {
    return null;
  }
  return propertySchema.parse(await response.json());
}
