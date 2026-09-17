"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { StandardInput } from "@/components/ui/inputs/standard-input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { parseAuthUser } from "@/schemas/auth-user-schema";
import { safeNextPath } from "@/lib/safe-next-path";
import { markMessagesArrivedFromLogin } from "@/lib/messages-back-navigation";

/** Fallback FR si le BFF ne renvoie pas de message (ne jamais afficher du texte brut EN). */
function loginUiMessage(status: number): string {
  if (status === 401) {
    return "E-mail ou mot de passe incorrect.";
  }
  if (status === 400) {
    return "Données d'identification incorrectes.";
  }
  if (status === 429) {
    return "Trop de tentatives. Réessayez plus tard.";
  }
  return "Impossible de se connecter. Réessayez.";
}

function readFrenchApiMessage(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const message = (body as { message?: unknown }).message;
  if (typeof message !== "string" || message.length === 0) {
    return null;
  }
  // Garde-fou : un message serveur EN ne doit pas remonter à l’UI.
  if (/[A-Za-z]{3,}/.test(message) && !/[àâäéèêëïîôùûüçœ]/i.test(message)) {
    const looksEnglish =
      /\b(invalid|credentials|required|error|password|email|forbidden|unauthorized|internal|server)\b/i.test(
        message,
      );
    if (looksEnglish) {
      return null;
    }
  }
  return message;
}

/**
 * Formulaire login (cookie JWT HttpOnly posé par le BFF `POST /api/login`).
 *
 * @remarks
 * Flux post-succès :
 * 1. `setAuthUser` (Context) ;
 * 2. `safeNextPath(?next)` — refuse les URLs externes / protocol-relative ;
 * 3. si next = messagerie → `markMessagesArrivedFromLogin` (évite Retour → `/login`) ;
 * 4. `router.replace` + `refresh` (pas `push`, pour ne pas empiler `/login` dans l’historique).
 *
 * Enveloppé dans `<Suspense>` à cause de `useSearchParams`.
 */
export const LoginForm = () => {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
};

const LoginFormInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setError(readFrenchApiMessage(body) ?? loginUiMessage(response.status));
        return;
      }

      const user =
        typeof body === "object" && body !== null && "user" in body
          ? (body as { user: unknown }).user
          : undefined;
      const parsed = parseAuthUser(user);
      if (!parsed) {
        setError("Connexion impossible. Réessayez.");
        return;
      }

      setAuthUser(parsed);
      const next = safeNextPath(searchParams.get("next"), "/");
      if (next === "/messages" || next.startsWith("/messages/")) {
        markMessagesArrivedFromLogin();
      }
      // `replace` : évite d’empiler `/login` si le flag n’est pas lu.
      router.replace(next);
      router.refresh();
    } catch {
      setError("Impossible de se connecter. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-185.5 flex-col items-center gap-9.5 rounded-kasa-cta border border-kasa-gray-light bg-kasa-white px-4 py-8 lg:px-20 lg:py-20"
    >
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-h1 font-bold text-kasa-red lg:flex lg:h-11.5 lg:items-center lg:justify-center">
          Heureux de vous revoir
        </h1>
        <p className="max-w-97.5 text-center text-body font-normal text-black">
          Connectez-vous pour retrouver vos réservations, vos annonces et tout
          ce qui rend vos séjours uniques.
        </p>
      </div>

      <div className="flex w-full max-w-90 flex-col gap-5.5">
        <StandardInput
          type="email"
          name="email"
          placeholder="Votre email"
          label="Adresse email"
          id="email"
          width="w-full"
          autoComplete="email"
          required
        />
        <StandardInput
          type="password"
          name="password"
          placeholder="Votre mot de passe"
          label="Mot de passe"
          id="password"
          width="w-full"
          autoComplete="current-password"
          required
        />
        {/* Emplacement fixe : évite le saut du bouton quand l’erreur apparaît. */}
        <p
          role="alert"
          aria-live="polite"
          className="flex min-h-5 w-full items-center justify-center text-center text-caption font-normal text-kasa-red"
        >
          {error ?? "\u00A0"}
        </p>
        <Button
          type="submit"
          color="red"
          width="w-full"
          height="h-10"
          className="mx-auto max-w-57.5 text-body font-medium text-kasa-white disabled:cursor-not-allowed disabled:opacity-60"
          size="medium"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Connexion…" : "Se connecter"}
        </Button>
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/forgot-password"
            className="text-center text-body font-normal text-kasa-red"
          >
            Mot de passe oublié
          </Link>
          <p className="text-center text-body font-normal text-kasa-red">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-medium text-kasa-red">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};
