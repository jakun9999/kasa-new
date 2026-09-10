export const propertyGridClassName =
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

const skeletonFill = "bg-kasa-gray-dark/25";

function Pulse({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-kasa-short ${skeletonFill} ${className}`}
    />
  );
}

/** Placeholder aux dimensions de `PropertyCard` (Gris dark 25 % — un cran sous Gris light). */
export function PropertyCardSkeleton() {
  return (
    <article className="relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-kasa-cta bg-kasa-white">
      <div className={`h-94 w-full animate-pulse ${skeletonFill}`} />
      <div
        className={`absolute top-4 right-4 size-8 animate-pulse rounded-kasa-short ${skeletonFill}`}
      />
      <div className="flex flex-1 flex-col justify-between gap-15.5 px-6 pt-4 pb-6">
        <div className="flex flex-col gap-2">
          <Pulse className="h-6 w-3/4" />
          <Pulse className="h-4 w-1/2" />
        </div>
        <Pulse className="h-4 w-24" />
      </div>
    </article>
  );
}

export function PropertyCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul
      className={propertyGridClassName}
      aria-busy="true"
      aria-label="Chargement des logements"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="min-w-0">
          <PropertyCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
