import type { MetadataRoute } from "next";
import { propertiesSchema } from "@/schemas/property";

/**
 * URL publique du front (sitemap = URLs absolues).
 * Prod / démo : définir `NEXT_PUBLIC_SITE_URL` (ex. https://kasa.example.com).
 */
function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return "http://localhost:8080";
}

/**
 * Sitemap dynamique (`/sitemap.xml`).
 * Pages indexables : accueil, à propos, chaque fiche logement (`id-slug`).
 * Exclus volontairement : login, messagerie, `/?favoris=1` (auth / non SEO).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiUrl) {
    return staticRoutes;
  }

  try {
    const response = await fetch(`${apiUrl}/api/properties`, {
      // Pas de cookie / auth : liste publique, comme la home.
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return staticRoutes;
    }

    const properties = propertiesSchema.parse(await response.json());

    const propertyRoutes: MetadataRoute.Sitemap = properties.map(
      (property) => ({
        // Même format que `PropertyCard` : `/properties/{id}-{slug}`
        url: `${siteUrl}/properties/${property.id}-${property.slug ?? ""}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    );

    return [...staticRoutes, ...propertyRoutes];
  } catch {
    // Backend down au build / crawl : on garde au moins les pages statiques.
    return staticRoutes;
  }
}
