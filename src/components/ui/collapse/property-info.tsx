"use client";

import { Collapse } from "@/components/ui/collapse/collapse";
import { LocalisationIcon } from "@/components/icons/localisation-icon";
import type { Property } from "@/schemas/property";

type PropertyInfoProps = {
  property: Property;
};

/** Carte blanche : titre, description et panneaux repliables Équipements / Catégories. */
export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="flex flex-col gap-10 rounded-kasa-cta border border-kasa-gray-light bg-kasa-white p-6">
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
        <Collapse title="Description">
          <p className="text-[18px] font-normal text-kasa-black">
            {property.description || ""}
          </p>
        </Collapse>
      </div>

      {property.equipments && property.equipments.length > 0 ? (
        <Collapse title="Équipements">
          <div className="grid w-full max-w-79 grid-cols-2 gap-2 sm:grid-cols-3">
            {property.equipments.map((equipment) => (
              <p
                key={equipment}
                className="flex h-8.25 min-w-0 items-center justify-center rounded-kasa-short bg-kasa-gray-light px-2 text-center text-[12px] leading-3.5 font-normal text-kasa-gray-dark"
              >
                {equipment}
              </p>
            ))}
          </div>
        </Collapse>
      ) : null}

      {property.tags && property.tags.length > 0 ? (
        <Collapse title="Catégories">
          <div className="grid w-full max-w-79 grid-cols-2 gap-4.5 sm:grid-cols-3">
            {property.tags.map((tag) => (
              <p
                key={tag}
                className="flex h-8.25 min-w-0 items-center justify-center rounded-kasa-short bg-kasa-gray-light px-2 text-center text-[12px] leading-3.5 font-normal text-kasa-gray-dark"
              >
                {tag}
              </p>
            ))}
          </div>
        </Collapse>
      ) : null}
    </div>
  );
}
