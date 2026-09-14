import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "À propos",
  description: "À propos de Kaza",
};

export default function About() {
  return (
    <main className="mx-auto flex w-full max-w-278.75 flex-col items-center gap-10 px-2 lg:px-0">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-h1 font-bold text-kasa-red lg:flex lg:h-11.5 lg:items-center lg:justify-center">
          À propos
        </h1>
        <div className="max-w-185.5 space-y-4 text-center text-body font-normal text-kasa-black">
          <p>
            Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où
            se sentir bien.
          </p>
          <p>
            Depuis notre création, nous mettons en relation des voyageurs en
            quête d’authenticité avec des hôtes passionnés qui aiment partager
            leur région et leurs bonnes adresses.
          </p>
        </div>
      </div>

      <Image
        src="/about_1.png"
        alt="Maison moderne en bois au milieu de la nature"
        width={1115}
        height={458}
        className="h-auto w-full rounded-[20px] object-cover aspect-4/3 lg:aspect-auto lg:h-114.5 lg:w-278.75"
        priority
      />

      {/*
        Mobile / tablette : mission → image 2 → conclusion (colonne).
        Desktop : mission + conclusion à gauche, image 2 à droite (inchangé).
      */}
      <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-4">
          <h2 className="text-h3 font-bold text-kasa-red">
            Notre mission est simple :
          </h2>
          <ol className="flex list-inside list-decimal flex-col items-start justify-center gap-4">
            <li className="text-body font-normal text-kasa-black">
              Offrir une plateforme fiable et simple d’utilisation
            </li>
            <li className="text-body font-normal text-kasa-black">
              Proposer des hébergements variés et de qualité
            </li>
            <li className="text-body font-normal text-kasa-black">
              Favoriser des échanges humains et chaleureux entre hôtes et
              voyageurs
            </li>
          </ol>
          <p className="hidden text-h3 font-medium text-kasa-red lg:block">
            Que vous cherchiez un appartement cosy en centre-ville, une maison
            en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour
            que chaque séjour devienne un souvenir inoubliable.
          </p>
        </div>

        <Image
          src="/about_2.png"
          alt="Chalet contemporain éclairé au crépuscule"
          width={494}
          height={458}
          className="h-auto w-full rounded-[20px] object-cover aspect-4/3 lg:aspect-auto lg:h-114.5 lg:w-123.5 lg:shrink-0"
        />

        <p className="text-h3 font-medium text-kasa-red lg:hidden">
          Que vous cherchiez un appartement cosy en centre-ville, une maison en
          bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que
          chaque séjour devienne un souvenir inoubliable.
        </p>
      </div>
    </main>
  );
}
