import { z } from "zod";

/**
 * Hôte d’un logement (`PropertyHost` OpenAPI).
 * Aucun champ n’est requis par la spec.
 */
export const propertyHostSchema = z.object({
  id: z.int().optional(),
  name: z.string().optional(),
  picture: z.string().nullable().optional(),
});

export type PropertyHost = z.infer<typeof propertyHostSchema>;

/**
 * Un logement en liste (`PropertyBase` OpenAPI).
 * Réponse de chaque item de `GET /api/properties`.
 */
export const propertySchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  price_per_night: z.number(),
  pictures: z.array(z.string()).nullable().optional(),
  equipments: z.array(z.string()).nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  rating_avg: z.number().optional(),
  ratings_count: z.int().optional(),
  host: propertyHostSchema.optional(),
});

export type Property = z.infer<typeof propertySchema>;

/** Liste des logements : `GET /api/properties`. */
export const propertiesSchema = z.array(propertySchema);

export type Properties = z.infer<typeof propertiesSchema>;
