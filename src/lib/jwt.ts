import jwt from "jsonwebtoken";

const CLOCK_SKEW_SEC = 30;

let warnedMissingSecret = false;
let warnedVerifyFailed = false;

function decodeBase64Url(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const bytes = Uint8Array.from(atob(padded + pad), (char) =>
    char.charCodeAt(0),
  );
  return new TextDecoder().decode(bytes);
}

function hasValidTimeClaims(payload: Record<string, unknown>): boolean {
  const now = Math.floor(Date.now() / 1000);

  if (typeof payload.exp !== "number") {
    return false;
  }

  if (now >= payload.exp + CLOCK_SKEW_SEC) {
    return false;
  }

  if (typeof payload.nbf === "number" && now + CLOCK_SKEW_SEC < payload.nbf) {
    return false;
  }

  return true;
}

/**
 * Lit `JWT_SECRET` (trim + retire guillemets éventuels collés par cPanel / `.env`).
 */
export function getJwtSecret(): string | undefined {
  let secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    return undefined;
  }
  if (
    (secret.startsWith('"') && secret.endsWith('"')) ||
    (secret.startsWith("'") && secret.endsWith("'"))
  ) {
    secret = secret.slice(1, -1);
  }
  return secret.length > 0 ? secret : undefined;
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

/**
 * `id` utilisateur du payload JWT backend (`{ id, role, name, email }`).
 * À n’appeler que sur un jeton déjà validé par {@link isSessionJwtUsable}.
 */
export function getJwtUserId(token: string): number | undefined {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return undefined;
  }

  const { id } = payload;
  if (typeof id === "number" && Number.isInteger(id)) {
    return id;
  }
  if (typeof id === "string" && /^\d+$/.test(id)) {
    return Number(id);
  }
  return undefined;
}

/**
 * Cookie `token` utilisable comme session front.
 *
 * @remarks
 * 1. Forme JWT + `exp` obligatoires.
 * 2. Si `JWT_SECRET` est défini : `jwt.verify` (même lib que l’API).
 * 3. Si secret **absent** ou **incorrect** (souvent o2switch) : on accepte quand même
 *    un JWT bien formé — le **backend** reste la source de vérité sur les routes API.
 *    Sans ça, cookie visible + 401 `/api/favorites` dès que cPanel n’injecte pas le secret.
 */
export async function isSessionJwtUsable(token: string): Promise<boolean> {
  const payload = decodeJwtPayload(token);
  if (!payload || !hasValidTimeClaims(payload)) {
    return false;
  }

  const secret = getJwtSecret();
  if (!secret) {
    if (!warnedMissingSecret) {
      warnedMissingSecret = true;
      console.error(
        "[kasa] JWT_SECRET absent au runtime — session acceptée sur forme JWT seule. Définis JWT_SECRET dans cPanel (Setup Node.js App), sans guillemets, identique au backend.",
      );
    }
    return true;
  }

  try {
    jwt.verify(token, secret, {
      algorithms: ["HS256"],
      clockTolerance: CLOCK_SKEW_SEC,
    });
    return true;
  } catch (error) {
    if (!warnedVerifyFailed) {
      warnedVerifyFailed = true;
      console.error(
        "[kasa] jwt.verify a échoué (JWT_SECRET différent du backend ?). Fallback forme JWT — corrige le secret cPanel.",
        error instanceof Error ? error.message : error,
      );
    }
    // Secret faux sur le front mais token émis par le backend : on laisse passer ;
    // `fetchServer` + API Express refusent toujours un jeton vraiment invalide.
    return true;
  }
}
