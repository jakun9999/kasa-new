import { Suspense } from "react";
import Image from "next/image";
import { fetchServer } from "@/lib/api-server";
import { parseShowFavoritesOnly } from "@/lib/favorites";
import { propertiesSchema } from "@/schemas/property";
import { PropertyGrid } from "@/components/ui/cards/property-grid";
import { PropertyCardGridSkeleton } from "@/components/ui/cards/property-card-skeleton";

type HomeProps = {
  searchParams: Promise<{ favoris?: string | string[] }>;
};

async function PropertyList({
  showFavoritesOnly,
}: {
  showFavoritesOnly: boolean;
}) {
  // Timer de démo : visible uniquement en `next dev`, pour voir le skeleton.
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const response = await fetchServer("/api/properties", { auth: false });
  if (!response.ok) {
    return <p>Impossible de charger les logements ({response.statusText}).</p>;
  }
  const properties = propertiesSchema.parse(await response.json());
  return (
    <PropertyGrid
      properties={properties}
      showFavoritesOnly={showFavoritesOnly}
    />
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const showFavoritesOnly = parseShowFavoritesOnly(params.favoris);

  return (
    <main
      className={`mx-auto flex w-full max-w-278.75 flex-col items-center gap-10 lg:px-0 ${
        showFavoritesOnly ? "px-[1.5px]" : "px-2"
      }`}
    >
      <div className="flex flex-col items-center justify-between gap-2 h-30.5 lg:h-23.5 lg:w-185.5">
        <h1 className="text-center text-h1 font-bold text-kasa-red lg:h-11.5">
          {showFavoritesOnly ? "Vos favoris" : "Chez vous, partout et ailleurs"}
        </h1>
        <p className="text-center text-body font-normal text-kasa-black px-2">
          {showFavoritesOnly
            ? "Retrouvez ici tous les logements que vous avez aimés. Prêts à réserver ? Un simple clic et votre prochain séjour est en route."
            : "Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes."}
        </p>
      </div>
      {!showFavoritesOnly ? (
        <div className="relative aspect-1115/458 w-full min-w-0 shrink-0 overflow-hidden rounded-[20px]">
          <Image
            src="/hero.jpg"
            alt="Paysage et hébergements Kasa"
            fill
            sizes="(max-width: 1150px) 100vw, 1115px"
            className="object-cover"
            priority
            fetchPriority="high"
          />
        </div>
      ) : null}
      <div className="flex w-full flex-col gap-8">
        <h2 className="text-h2 font-medium text-kasa-black">
          {showFavoritesOnly ? "Logements favoris" : "Nos logements"}
        </h2>
        <Suspense
          fallback={
            showFavoritesOnly ? (
              <p className="text-center text-body text-kasa-gray-dark">
                Chargement de vos favoris…
              </p>
            ) : (
              <PropertyCardGridSkeleton />
            )
          }
        >
          <PropertyList showFavoritesOnly={showFavoritesOnly} />
        </Suspense>
      </div>
    </main>
  );
}
