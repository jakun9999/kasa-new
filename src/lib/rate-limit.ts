import { NextResponse } from "next/server";

export type RateLimitConfig = {
  /** Nombre max de tentatives dans la fenêtre. */
  limit: number;
  /** Fenêtre glissante, en millisecondes. */
  windowMs: number;
};

/**
 * Plafonds BFF (fenêtre glissante, mémoire process).
 * Login un peu plus permissif : fautes de frappe.
 */
export const RATE_LIMITS = {
  signin: { limit: 5, windowMs: 15 * 60 * 1000 },
  login: { limit: 10, windowMs: 15 * 60 * 1000 },
} as const satisfies Record<string, RateLimitConfig>;

const hits = new Map<string, number[]>();

/**
 * IP client pour le throttle auth.
 * `X-Forwarded-For` n’est fiable **que** derrière un reverse proxy qui l’écrase.
 * Sans proxy, un attaquant peut forger le header (contournement).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const fromForwarded = forwarded?.split(",")[0]?.trim();
  if (fromForwarded) {
    return fromForwarded;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

/**
 * Fenêtre glissante : on garde les horodatages récents par clé (`login:ip`).
 * Map en mémoire : perdu au redémarrage, non partagé entre instances.
 */
export function consumeRateLimit(
  key: string,
  { limit, windowMs }: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  const stamps = (hits.get(key) ?? []).filter((stamp) => stamp > cutoff);

  if (stamps.length >= limit) {
    hits.set(key, stamps);
    const retryAfterSec = Math.max(
      1,
      Math.ceil((stamps[0] + windowMs - now) / 1000),
    );
    return { allowed: false, retryAfterSec };
  }

  stamps.push(now);
  hits.set(key, stamps);
  return { allowed: true };
}

function formatRetryAfter(retryAfterSec: number): string {
  if (retryAfterSec >= 60) {
    return `${Math.ceil(retryAfterSec / 60)} min`;
  }
  return `${retryAfterSec} s`;
}

/** JSON 429 + `Retry-After` (secondes). */
export function tooManyRequestsResponse(
  retryAfterSec: number,
  action: string,
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message: `Trop de ${action}. Réessayez dans ${formatRetryAfter(retryAfterSec)}.`,
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}

/**
 * `null` si la requête passe, sinon réponse 429.
 *
 * @param key - Identifiant de seau (`signin:ip`, `login:ip`).
 */
export function enforceRateLimit(
  key: string,
  config: RateLimitConfig,
  action: string,
): NextResponse | null {
  const result = consumeRateLimit(key, config);
  if (result.allowed) {
    return null;
  }
  return tooManyRequestsResponse(result.retryAfterSec, action);
}