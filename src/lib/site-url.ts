/**
 * URL publique du front (sitemap, canonical, JSON-LD).
 * Prod / démo : `NEXT_PUBLIC_SITE_URL` (ex. https://kasa.example.com).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return "http://localhost:8080";
}

/** Path fiche — même format que `PropertyCard` / sitemap. */
export function propertyHref(id: string, slug?: string): string {
  return `/properties/${id}-${slug ?? ""}`;
}
