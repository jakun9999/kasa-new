import { Suspense } from "react";
import Image from "next/image";
import { fetchServer } from "@/lib/api-server";
import { parseShowFavoritesOnly } from "@/lib/favorites";
import { propertiesSchema } from "@/schemas/property";
import { PropertyGrid } from "@/components/ui/cards/property-grid";
import {
  PropertyCardGridSkeleton,
} from "@/components/ui/cards/property-card-skeleton";

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
    <main className="mx-auto flex max-w-278.75 flex-col items-center gap-10 px-2 lg:px-0">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-h1 font-bold text-kasa-red lg:h-11.5">
          {showFavoritesOnly
            ? "Vos favoris"
            : "Chez vous, partout et ailleurs"}
        </h1>
        <p className="text-center text-body font-normal text-kasa-black">
          {showFavoritesOnly
            ? "Retrouvez ici les logements que vous avez ajoutés à vos favoris."
            : "Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes."}
        </p>
      </div>
      {!showFavoritesOnly ? (
        <Image
          src="/hero.jpg"
          alt="Hero"
          width={1115}
          height={458}
          className="aspect-1115/458 h-auto w-full rounded-[20px] object-cover"
          priority
          loading="eager"
        />
      ) : null}
      <div className="flex w-full flex-col gap-8">
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
