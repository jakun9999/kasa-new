import { z } from "zod";

/** Profil utilisateur authentifié exposé par l’API (jamais de mot de passe). */
export const AuthUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  /** OpenAPI : `email` nullable / non requis — on normalise en string (éventuellement vide). */
  email: z.string(),
  picture: z.string(),
  role: z.enum(["owner", "client", "admin"]),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

/** Normalise un user backend (`picture` / `email` souvent null). */
export function parseAuthUser(raw: unknown): AuthUser | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }
  const record = raw as Record<string, unknown>;
  const parsed = AuthUserSchema.safeParse({
    id: record.id,
    name: record.name,
    role: record.role,
    picture: typeof record.picture === "string" ? record.picture : "",
    email: typeof record.email === "string" ? record.email : "",
  });
  return parsed.success ? parsed.data : null;
}
