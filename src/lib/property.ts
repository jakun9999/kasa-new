import { fetchServer } from "@/lib/api-server";
import { propertySchema, type Property } from "@/schemas/property";

/**
 * Extrait l’id API depuis le param de route `{id}-{slug}`.
 *
 * @remarks
 * On ne prend que le **premier** segment avant `-` :
 * l’id backend est un string court ; le reste du path est le slug SEO.
 * Ex. `c67ab8a7-appartement-paris` → `c67ab8a7`.
 * Doit rester aligné avec `propertyHref` / `PropertyCard`.
 */
export function propertyIdFromSlugParam(slugParam: string): string {
  return slugParam.split("-")[0] ?? slugParam;
}

/**
 * Charge un logement pour la fiche et `generateMetadata` (même fetch dédupliqué Next).
 * @returns `null` si 404 / erreur — la page appelle alors `notFound()`.
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
