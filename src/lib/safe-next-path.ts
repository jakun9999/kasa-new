/**
 * Cible de redirection post-login sûre (chemin relatif same-origin uniquement).
 * Refuse les URL absolues / protocol-relative (`//evil.com`).
 */
export function safeNextPath(
  raw: string | null | undefined,
  fallback = "/",
): string {
  if (
    typeof raw !== "string" ||
    raw.length === 0 ||
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.includes("://")
  ) {
    return fallback;
  }
  return raw;
}
