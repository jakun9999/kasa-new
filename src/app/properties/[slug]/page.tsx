import { propertySchema } from "@/schemas/property";
import { fetchServer } from "@/lib/api-server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BackIcon } from "@/components/icons/back-icon";
import { StarIcon } from "@/components/icons/star-icon";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { buildPropertyImages } from "@/components/ui/carousel/carousel-utils";
import { CarouselSkeleton } from "@/components/ui/carousel/carousel-skeleton";
import { DelayedCarousel } from "@/components/ui/carousel/delayed-carousel";
import { PropertyInfo } from "@/components/ui/collapse/property-info";
import { PropertyContactActions } from "@/components/ui/property/property-contact-actions";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const id = slug.split("-")[0];

  const response = await fetchServer(`/api/properties/${id}`, {
    auth: false,
  });
  if (!response.ok) {
    return notFound();
  }
  const property = propertySchema.parse(await response.json());
  const carouselImages = buildPropertyImages(
    property.cover,
    property.pictures,
  );

  return (
    <article className="mx-auto flex w-full max-w-242 flex-col gap-10 pt-4">
      {/* Retour aux annonces — reste à gauche */}
      <Link href="/" className="self-start">
        <Button
          size="long"
          color="gray"
          width="w-47.25"
          height="h-9"
          className="font-medium text-body ml-1.75"
          icon={<BackIcon />}
        >
          Retour aux annonces
        </Button>
      </Link>
      {/*
        Mobile / tablette : colonne centrée (carousel max-w-154 ne colle plus à gauche).
        Desktop lg+ : rangée Figma, étirée sur toute la largeur.
      */}
      <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-2.5">
        <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-6 lg:items-stretch">
          <Suspense fallback={<CarouselSkeleton />}>
            <DelayedCarousel
              images={carouselImages}
              alt={property.title || ""}
            />
          </Suspense>
          <div className="w-full max-w-154 min-w-0 lg:w-154">
            <PropertyInfo property={property} />
          </div>
        </div>
        {/* Informations de l'hôte */}
        <div className="flex w-full max-w-154 shrink-0 flex-col gap-2.5 rounded-kasa-cta border border-kasa-gray-light bg-kasa-white p-6 lg:h-70.25 lg:max-w-none lg:w-86.25">
          <p className="text-[16px] font-medium text-kasa-black">Votre hôte</p>
          <div className="flex py-4 gap-4.5 items-center justify-start">
            {/* Image de l'hôte */}
            <Image
              src={property.host?.picture || ""}
              alt={property.host?.name || ""}
              width={82}
              height={82}
              className="rounded-kasa-cta object-cover w-20.5 h-20.5"
              loading="eager"
            />
            {/* Nom de l'hôte */}
            <p className="text-[16px] font-normal text-kasa-black">
              {property.host?.name || ""}
            </p>
            {/* Note de l'hôte */}
            <Button
              size="long"
              color="gray"
              width="w-12.5"
              height="h-9.75"
              className="font-normal text-[16px] shrink-0"
              icon={<StarIcon />}
              aria-label={`Note ${property.rating_avg ?? 0} sur 5`}
            >
              {property.rating_avg ?? 0}
            </Button>
          </div>
          {/* Boutons contact → messagerie (auth) ou login */}
          <PropertyContactActions />
        </div>
      </div>
    </article>
  );
}
