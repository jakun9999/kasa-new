import { z } from "zod";

/** Corps de `POST /api/login` (email + mot de passe non vide). */
export const LoginSchema = z.object({
  email: z.email("Format d'e-mail incorrect"),
  password: z
    .string()
    .min(1, "Mot de passe obligatoire")
    .max(100, "Mot de passe trop long"),
});
