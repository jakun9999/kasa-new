import type { Property } from "@/schemas/property";
import { buildPropertyImages } from "@/components/ui/carousel/carousel-utils";
import { getSiteUrl, propertyHref } from "@/lib/site-url";

/**
 * JSON-LD Schema.org pour une fiche logement.
 * Type choisi : **Accommodation** (hébergement) + **Offer** imbriquée (prix / nuit).
 * On ne mappe que des champs fournis par l’API (pas de `petsAllowed` inventé).
 */
export function buildPropertyAccommodationJsonLd(property: Property) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${propertyHref(property.id, property.slug)}`;
  const images = buildPropertyImages(property.cover, property.pictures);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: property.title,
    url,
  };

  if (property.description) {
    jsonLd.description = property.description;
  }

  if (images.length > 0) {
    jsonLd.image = images.length === 1 ? images[0] : images;
  }

  if (property.location) {
    // `location` API = texte libre (ex. « Paris, Île-de-France »), pas une adresse structurée.
    jsonLd.address = {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "FR",
    };
  }

  jsonLd.offers = {
    "@type": "Offer",
    price: property.price_per_night,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url,
  };

  if (property.equipments && property.equipments.length > 0) {
    jsonLd.amenityFeature = property.equipments.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
    }));
  }

  if (
    property.rating_avg != null &&
    property.ratings_count != null &&
    property.ratings_count > 0
  ) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: property.rating_avg,
      reviewCount: property.ratings_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (property.host?.name) {
    jsonLd.provider = {
      "@type": "Person",
      name: property.host.name,
      ...(property.host.picture
        ? { image: property.host.picture }
        : {}),
    };
  }

  return jsonLd;
}
