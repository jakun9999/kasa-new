"use client";

import Image from "next/image";
import { useState } from "react";
import { Property } from "@/schemas/property";
import { Button } from "@/components/ui/button";
import { FavoriteIcon } from "@/components/icons/favorite-icon";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  return (
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
            onLoad={() => setImageLoaded(true)}
          />
        ) : null}
      </div>
      <Button
        size="short"
        color="gray"
        icon={<FavoriteIcon className="w-2.5 h-[9.32px]" />}
        aria-label={`Ajouter ${property.title} aux favoris`}
        className="group absolute top-4 right-4 z-10 hover:bg-kasa-red-dark ease-in-out duration-300"
        onClick={handleFavorite}
      />
      <div className="flex flex-1 flex-col justify-between gap-15.5 px-6 pt-4 pb-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-kasa-black text-h3 font-medium">
            {property.title}
          </h3>
          <p className="text-body text-kasa-gray-dark font-normal">
            {property.location}
          </p>
        </div>
        <p>
          <span className="text-body font-medium">
            {property.price_per_night}
          </span>
          {"€ "}
          <span className="text-body text-kasa-gray-dark font-normal">
            par nuit
          </span>
        </p>
      </div>
    </article>
  );
}
