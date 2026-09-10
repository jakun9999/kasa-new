const CLOCK_SKEW_SEC = 30;

function decodeBase64Url(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const bytes = Uint8Array.from(atob(padded + pad), (char) =>
    char.charCodeAt(0),
  );
  return new TextDecoder().decode(bytes);
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Décode le payload JWT **sans** vérifier la signature.
 *
 * @returns Payload JSON, ou `null` si le jeton n’a pas la forme `header.payload.sig`.
 */
export function decodeJwtPayload(
  token: string,
): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(decodeBase64Url(parts[1]));
    if (
      typeof payload !== "object" ||
      payload === null ||
      Array.isArray(payload)
    ) {
      return null;
    }
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function verifyHs256Signature(
  token: string,
  secret: string,
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  let alg: string | undefined;
  try {
    const header: unknown = JSON.parse(decodeBase64Url(parts[0]));
    if (typeof header === "object" && header !== null && "alg" in header) {
      alg = typeof header.alg === "string" ? header.alg : undefined;
    }
  } catch {
    return false;
  }

  if (alg !== "HS256") {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );

  return timingSafeEqual(
    encodeBase64Url(new Uint8Array(signature)),
    parts[2],
  );
}

function hasValidTimeClaims(payload: Record<string, unknown>): boolean {
  const now = Math.floor(Date.now() / 1000);

  if (
    typeof payload.exp === "number" &&
    now >= payload.exp + CLOCK_SKEW_SEC
  ) {
    return false;
  }

  if (typeof payload.nbf === "number" && now + CLOCK_SKEW_SEC < payload.nbf) {
    return false;
  }

  return true;
}

/**
 * Cookie `token` utilisable comme session **côté frontend** :
 * forme JWT + `exp` / `nbf`, et HMAC-SHA256 si `JWT_SECRET` est défini.
 * Sans secret (cas OC), un jeton contrefait avec un `exp` futur passe encore.
 */
export async function isSessionJwtUsable(token: string): Promise<boolean> {
  const payload = decodeJwtPayload(token);
  if (!payload || !hasValidTimeClaims(payload)) {
    return false;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return true;
  }

  return verifyHs256Signature(token, secret);
}