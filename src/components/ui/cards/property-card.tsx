"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { Property } from "@/schemas/property";
import { Button } from "@/components/ui/button";
import { FavoriteIcon } from "@/components/icons/favorite-icon";
import { useFavorites } from "@/context/favorites-context";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({
  property,
  priority = false,
}: PropertyCardProps) {
  const { isFavorite, toggleFavorite, isReady } = useFavorites();
  const favorite = isFavorite(property.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleFavorite(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(property.id);
  }

  return (
    <Link href={`/properties/${property.id}-${property.slug}`}>
      <article className="relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-kasa-cta bg-kasa-white">
        <div className="relative h-94 w-full bg-kasa-gray-dark/25">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-kasa-gray-dark/25" />
          )}
          {property.cover ? (
            <Image
              src={property.cover}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              priority={priority}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
            />
          ) : null}
        </div>
        <Button
          type="button"
          size="short"
          color={favorite ? "red" : "gray"}
          icon={
            <FavoriteIcon
              className="h-[9.32px] w-2.5"
              pathClassName={
                favorite
                  ? "fill-kasa-white stroke-kasa-white"
                  : "fill-kasa-gray-dark stroke-kasa-gray-light transition-colors group-hover:fill-kasa-red-light"
              }
            />
          }
          aria-label={
            favorite
              ? `Retirer ${property.title} des favoris`
              : `Ajouter ${property.title} aux favoris`
          }
          aria-pressed={favorite}
          disabled={!isReady}
          className="group absolute top-4 right-4 z-10 duration-300 ease-in-out hover:bg-kasa-red-dark"
          onClick={handleFavorite}
        />
        <div className="flex flex-1 flex-col justify-between gap-15.5 px-6 pt-4 pb-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-h3 font-medium text-kasa-black">
              {property.title}
            </h3>
            <p className="text-body font-normal text-kasa-gray-dark">
              {property.location}
            </p>
          </div>
          <p>
            <span className="text-body font-medium">
              {property.price_per_night}
            </span>
            {"€ "}
            <span className="text-body font-normal text-kasa-gray-dark">
              par nuit
            </span>
          </p>
        </div>
      </article>
    </Link>
  );
}
