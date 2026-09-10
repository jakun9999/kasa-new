import { NextResponse } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function allowedOrigins(request: Request): Set<string> {
  const url = new URL(request.url);
  const origins = new Set<string>([url.origin]);

  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  if (forwardedHost) {
    const proto = forwardedProto || url.protocol.replace(":", "");
    origins.add(`${proto}://${forwardedHost}`);
  }

  return origins;
}

function requestOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin === "null" ? null : origin;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

/** Origine navigateur ∈ `{ request.url, X-Forwarded-Host }`. */
export function isSameOriginRequest(request: Request): boolean {
  const origin = requestOrigin(request);
  if (!origin) {
    return false;
  }
  return allowedOrigins(request).has(origin);
}

/**
 * Corps vide (logout) ou JSON. Un formulaire HTML cross-site envoie
 * `application/x-www-form-urlencoded` : rejeté.
 */
export function isJsonOrEmptyContentType(request: Request): boolean {
  const contentType = request.headers.get("content-type");
  if (!contentType?.trim()) {
    return true;
  }
  return contentType.toLowerCase().includes("application/json");
}

export function isMutatingMethod(method: string): boolean {
  return MUTATING_METHODS.has(method.toUpperCase());
}

/** JSON 403 CSRF. */
export function csrfForbiddenResponse(): NextResponse {
  return NextResponse.json(
    { success: false, message: "Requête d’origine non autorisée." },
    { status: 403 },
  );
}

/**
 * Garde CSRF BFF : same-origin + pas de POST formulaire.
 * `null` si la requête passe (GET, ou POST same-origin JSON).
 */
export function enforceCsrf(request: Request): NextResponse | null {
  if (!isMutatingMethod(request.method)) {
    return null;
  }

  if (!isSameOriginRequest(request) || !isJsonOrEmptyContentType(request)) {
    return csrfForbiddenResponse();
  }

  return null;
}