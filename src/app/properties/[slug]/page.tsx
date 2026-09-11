import { propertySchema } from "@/schemas/property";
import { fetchServer } from "@/lib/api-server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BackIcon } from "@/components/icons/back-icon";
import { StarIcon } from "@/components/icons/star-icon";
import { LocalisationIcon } from "@/components/icons/localisation-icon";
import Image from "next/image";
import Link from "next/link";

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
  const pictures = property.pictures?.slice(0, 4) || [];

  return (
    <article className="flex flex-col pt-4 gap-10 max-w-242 mx-auto">
      {/* Retour aux annonces */}
      <Link href="/">
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
      {/* Informations à propos du logement */}
      <div className="flex gap-2.5">
        <div className="flex flex-col gap-6">
          {/* Image principale */}
          <div className="flex gap-2.5 w-154 h-89.5">
            <div className="relative h-full w-[303px] shrink-0">
              <Image
                src={property.cover || ""}
                alt={property.title || ""}
                fill
                sizes="303px"
                className="rounded-kasa-cta object-cover"
                loading="eager"
              />
            </div>
            {/* Images secondaires */}
            <div className="grid h-full min-w-0 flex-1 grid-cols-2 gap-2.5">
              {pictures.map((picture) => (
                <div key={picture} className="relative min-h-0 min-w-0">
                  <Image
                    src={picture || ""}
                    alt={property.title || ""}
                    fill
                    sizes="147px"
                    className="rounded-kasa-cta object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Informations du logement */}
          <div className="flex flex-col gap-10 rounded-kasa-cta bg-kasa-white p-6 border border-kasa-gray-light">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-[24px] font-medium text-kasa-black">
                  {property.title}
                </h1>
                <p className="flex items-center gap-2 text-[14px] font-normal text-kasa-gray-dark">
                  <LocalisationIcon />
                  {property.location || ""}
                </p>
              </div>
              <p className="text-[18px] font-normal text-kasa-black">
                {property.description || ""}
              </p>
            </div>
            {/* Équipements */}
            <div className="flex flex-col gap-4">
              <p className="text-[14px] font-medium text-kasa-black">
                Équipements
              </p>
              <div className="grid grid-cols-3 gap-2 w-79">
                {property.equipments?.map((equipment) => (
                  <p
                    key={equipment}
                    className="flex items-center justify-center w-25 h-8.25 text-[12px] font-normal text-kasa-gray-dark bg-kasa-gray-light rounded-kasa-short text-center leading-3.5"
                  >
                    {equipment}
                  </p>
                ))}
              </div>
            </div>
            {/* Catégories */}
            <div className="flex flex-col gap-4">
              <p className="text-[14px] font-medium text-kasa-black">
                Catégories
              </p>
              <div className="grid grid-cols-3 gap-4.5 w-79">
                {property.tags?.map((tag) => (
                  <p
                    key={tag}
                    className="flex items-center justify-center w-22 h-8.25 text-[12px] font-normal text-kasa-gray-dark bg-kasa-gray-light rounded-kasa-short text-center leading-3.5"
                  >
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Informations de l'hôte */}
        <div className="flex flex-col gap-2.5 p-6 bg-kasa-white rounded-kasa-cta border border-kasa-gray-light w-86.25 h-70.25">
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
          {/* Bouton de contact */}
          <Button
            size="long"
            color="red"
            width="w-74.25"
            height="h-9"
            className="font-medium text-body shrink-0"
          >
            Contacter l&apos;hôte
          </Button>
          {/* Bouton d'envoi de message */}
          <Button
            size="long"
            color="red"
            width="w-74.25"
            height="h-9"
            className="font-medium text-body shrink-0"
          >
            Envoyer un message
          </Button>
        </div>
      </div>
    </article>
  );
}
