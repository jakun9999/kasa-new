import type { Property } from "@/schemas/property";
import { buildPropertyImages } from "@/components/ui/carousel/carousel-utils";
import { getSiteUrl, propertyHref } from "@/lib/site-url";

/**
 * JSON-LD Schema.org pour une fiche logement.
 *
 * @remarks
 * Type : **Product** + **Offer** (prix / nuit). Alternative brief à `Accommodation`.
 * Le Rich Results Test Google ne reconnaît pas `Accommodation` seul (pas de rich
 * result associé) ; `Product`/`Offer` apparaît dans l’outil. Champs = API uniquement.
 */
export function buildPropertyAccommodationJsonLd(property: Property) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${propertyHref(property.id, property.slug)}`;
  const images = buildPropertyImages(property.cover, property.pictures);

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    price: property.price_per_night,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url,
  };

  if (property.host?.name) {
    offer.seller = {
      "@type": "Person",
      name: property.host.name,
      ...(property.host.picture ? { image: property.host.picture } : {}),
    };
  }

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    url,
    category: "Accommodation",
    offers: offer,
  };

  if (property.description) {
    jsonLd.description = property.description;
  }

  if (images.length > 0) {
    jsonLd.image = images.length === 1 ? images[0] : images;
  }

  if (property.location) {
    jsonLd.additionalProperty = [
      {
        "@type": "PropertyValue",
        name: "location",
        value: property.location,
      },
    ];
  }

  if (property.equipments && property.equipments.length > 0) {
    const amenities = property.equipments.map((name) => ({
      "@type": "PropertyValue",
      name: "amenity",
      value: name,
    }));
    jsonLd.additionalProperty = [
      ...((jsonLd.additionalProperty as unknown[]) ?? []),
      ...amenities,
    ];
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

  return jsonLd;
}
