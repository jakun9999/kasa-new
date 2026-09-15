"use client";

import { PropertyCard } from "@/components/ui/cards/property-card";
import { propertyGridClassName } from "@/components/ui/cards/property-card-skeleton";
import { useFavorites } from "@/context/favorites-context";
import { filterPropertiesByFavoriteIds } from "@/lib/favorites";
import type { Property } from "@/schemas/property";

type PropertyGridProps = {
  properties: Property[];
  /** Vue « Vos favoris » : filtre sur les ids du Context uniquement. */
  showFavoritesOnly: boolean;
};

/**
 * Grille client : le filtre favoris lit le Context / localStorage
 * (jamais une liste d’ids fournie par l’URL).
 */
export function PropertyGrid({
  properties,
  showFavoritesOnly,
}: PropertyGridProps) {
  const { favoriteIds, isReady } = useFavorites();

  const visible = showFavoritesOnly
    ? filterPropertiesByFavoriteIds(properties, favoriteIds)
    : properties;

  if (showFavoritesOnly && !isReady) {
    return (
      <p className="text-center text-body text-kasa-gray-dark">
        Chargement de vos favoris…
      </p>
    );
  }

  if (showFavoritesOnly && visible.length === 0) {
    return (
      <p className="text-center text-body text-kasa-gray-dark">
        Aucun favori pour le moment. Cliquez sur le cœur d’un logement pour
        l’ajouter ici.
      </p>
    );
  }

  return (
    <ul className={propertyGridClassName}>
      {visible.map((property, index) => (
        <li key={property.id} className="min-w-0">
          <PropertyCard property={property} priority={index === 0} />
        </li>
      ))}
    </ul>
  );
}
