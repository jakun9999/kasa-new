import { Suspense } from "react";
import Image from "next/image";
import { fetchServer } from "@/lib/api-server";
import { propertiesSchema } from "@/schemas/property";
import { PropertyCard } from "@/components/ui/cards/property-card";
import {
  PropertyCardGridSkeleton,
  propertyGridClassName,
} from "@/components/ui/cards/property-card-skeleton";

async function PropertyList() {
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
    <ul className={propertyGridClassName}>
      {properties.map((property, index) => (
        <li key={property.id} className="min-w-0">
          <PropertyCard property={property} priority={index === 0} />
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col gap-10 max-w-278.75 items-center">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-h1 font-bold text-kasa-red text-center h-11.5">
          Chez vous, partout et ailleurs
        </h1>
        <p>
          Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux,
          sélectionnés avec soin par nos hôtes.
        </p>
      </div>
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={1115}
        height={458}
        className="w-278.75 h-114.5 rounded-[20px]"
      />
      <div className="flex flex-col gap-8 w-full">
        <Suspense fallback={<PropertyCardGridSkeleton />}>
          <PropertyList />
        </Suspense>
      </div>
    </main>
  );
}
