"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { BackIcon } from "@/components/icons/back-icon";
import { Button } from "@/components/ui/button";
import { getThumbnailIndices } from "./carousel-utils";

type CarouselProps = {
  /** URLs des photos, dans l’ordre d’affichage. */
  images: string[];
  /** Texte alternatif de base (titre du logement). Chaque slide ajoute « photo n ». */
  alt: string;
  className?: string;
};

/**
 * Galerie fiche responsive :
 * - mobile / tablette : grande image pleine largeur, **4 miniatures en une rangée** en dessous ;
 * - desktop (`lg+`) : gabarit Figma 616 × 358 px, grande image + grille 2×2 à droite.
 * Miniatures synchronisées avec la photo principale ; flèches en overlay ; boucle ; clavier ← →.
 */
export function Carousel({ images, alt, className = "" }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const showControls = count > 1;
  const thumbnailIndices = getThumbnailIndices(index, count);

  if (count === 0) {
    return null;
  }

  const goTo = (direction: -1 | 1) => {
    setIndex((current) => (current + direction + count) % count);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!showControls) {
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(-1);
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label={`Photos — ${alt}`}
      tabIndex={showControls ? 0 : undefined}
      onKeyDown={onKeyDown}
      className={`relative mx-auto grid w-full max-w-154 grid-cols-1 gap-2.5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kasa-black lg:mx-0 lg:h-89.5 lg:w-154 lg:grid-cols-[303px_1fr] lg:grid-rows-1 ${className}`.trim()}
    >
      <div
        aria-label="Photo principale"
        className="relative col-start-1 row-start-1 aspect-303/357 w-full overflow-hidden rounded-kasa-cta lg:aspect-auto lg:h-full lg:w-75.75"
      >
        {images.map((src, imageIndex) => {
          const isCurrent = imageIndex === index;
          return (
            <div
              key={`${src}-${imageIndex}`}
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
                isCurrent ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={!isCurrent}
            >
              <Image
                src={src}
                alt={`${alt} — photo ${imageIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 303px"
                className="object-cover object-center"
                priority={imageIndex === 0}
              />
            </div>
          );
        })}

        {showControls ? (
          <p
            className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-caption font-medium text-kasa-white drop-shadow lg:bottom-4"
            aria-live="polite"
          >
            {index + 1}/{count}
          </p>
        ) : null}
      </div>

      {thumbnailIndices.length > 0 ? (
        <div
          aria-label="Miniatures"
          className="col-start-1 row-start-2 grid grid-cols-4 gap-2.5 lg:col-start-2 lg:row-start-1 lg:h-full lg:min-w-0 lg:grid-cols-2"
        >
          {thumbnailIndices.map((thumbnailIndex) => (
            <div
              key={`${images[thumbnailIndex]}-${thumbnailIndex}`}
              className="relative aspect-square min-h-0 min-w-0 overflow-hidden rounded-kasa-cta lg:aspect-auto lg:h-auto"
            >
              <Image
                src={images[thumbnailIndex]}
                alt={`${alt} — photo ${thumbnailIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 25vw, 147px"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      ) : null}

      {showControls ? (
        <>
          <Button
            size="short"
            color="gray"
            aria-label="Image précédente"
            className="pointer-events-auto z-10 col-start-1 row-start-1 ml-2 self-center justify-self-start lg:absolute lg:top-1/2 lg:left-4 lg:-translate-y-1/2"
            onClick={() => goTo(-1)}
            icon={<BackIcon />}
          />
          <Button
            size="short"
            color="gray"
            aria-label="Image suivante"
            className="pointer-events-auto z-10 col-start-1 row-start-1 mr-2 self-center justify-self-end lg:absolute lg:top-1/2 lg:right-4 lg:-translate-y-1/2"
            onClick={() => goTo(1)}
            icon={<BackIcon className="rotate-180" />}
          />
        </>
      ) : null}
    </div>
  );
}
