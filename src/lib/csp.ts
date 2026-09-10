import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function createCspNonce(): string {
  return btoa(crypto.randomUUID());
}

/**
 * CSP par requête. `script-src` : nonce + `strict-dynamic`, **sans**
 * `'unsafe-inline'`. En dev, `'unsafe-eval'` pour Fast Refresh.
 * `style-src` garde `'unsafe-inline'` (Tailwind / CSS Next).
 */
export function buildCspHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;
  const connectSrc = isDev
    ? "connect-src 'self' ws: wss:"
    : "connect-src 'self'";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    connectSrc,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

/** `NextResponse.next` avec nonce propagé pour que Next l’injecte aux scripts. */
export function nextWithCsp(request: NextRequest): NextResponse {
  const nonce = createCspNonce();
  const csp = buildCspHeader(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

/** Redirect / 403 : CSP sur la réponse uniquement (pas de HTML Next à noncer). */
export function withCspHeader(response: NextResponse): NextResponse {
  const csp = buildCspHeader(createCspNonce());
  response.headers.set("Content-Security-Policy", csp);
  return response;
}