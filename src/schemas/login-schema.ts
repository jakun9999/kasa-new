import { z } from "zod";

/** Corps de `POST /api/login` (email + mot de passe non vide). */
export const LoginSchema = z.object({
  email: z.email("Email format is incorrect"),
  password: z
    .string()
    .min(1, "Password is mandatory")
    .max(100, "Password is too long"),
});
