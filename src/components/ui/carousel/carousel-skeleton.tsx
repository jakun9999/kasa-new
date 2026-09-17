const skeletonFill = "animate-pulse bg-kasa-gray-dark/25";

/** Placeholder responsive : colonne mobile, gabarit Figma 616 × 358 px en desktop. */
export function CarouselSkeleton() {
  return (
    <div
      className="relative mx-auto grid w-full max-w-154 grid-cols-1 gap-2.5 lg:mx-0 lg:h-89.5 lg:w-154 lg:grid-cols-[303px_1fr] lg:grid-rows-1"
      aria-busy="true"
      aria-label="Chargement des photos"
    >
      <div
        className={`col-start-1 row-start-1 aspect-303/357 w-full rounded-kasa-cta lg:aspect-auto lg:h-full lg:w-75.75 ${skeletonFill}`}
      />
      <div className="col-start-1 row-start-2 grid grid-cols-4 gap-2.5 lg:col-start-2 lg:row-start-1 lg:h-full lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={`aspect-square min-h-0 min-w-0 rounded-kasa-cta lg:aspect-auto ${skeletonFill}`}
          />
        ))}
      </div>
      <div
        className={`col-start-1 row-start-1 z-10 ml-2 size-8 self-center justify-self-start rounded-kasa-short lg:absolute lg:top-1/2 lg:left-4 lg:-translate-y-1/2 ${skeletonFill}`}
      />
      <div
        className={`col-start-1 row-start-1 z-10 mr-2 size-8 self-center justify-self-end rounded-kasa-short lg:absolute lg:top-1/2 lg:right-4 lg:-translate-y-1/2 ${skeletonFill}`}
      />
    </div>
  );
}
