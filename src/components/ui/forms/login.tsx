"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StandardInput } from "@/components/ui/inputs/standard-input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { parseAuthUser } from "@/schemas/auth-user-schema";

function readApiMessage(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const message = (body as { message?: unknown }).message;
  return typeof message === "string" && message.length > 0 ? message : null;
}

export const LoginForm = () => {
  const router = useRouter();
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
        setError(
          readApiMessage(body) ??
            (response.status === 401
              ? "E-mail ou mot de passe incorrect."
              : "Impossible de se connecter. Réessayez."),
        );
        return;
      }

      const user =
        typeof body === "object" && body !== null && "user" in body
          ? (body as { user: unknown }).user
          : undefined;
      const parsed = parseAuthUser(user);
      if (!parsed) {
        setError("Connexion réussie mais profil invalide. Réessayez.");
        return;
      }

      setAuthUser(parsed);
      router.push("/");
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
      className="mx-auto flex w-full max-w-185.5 flex-col items-center gap-9.5 rounded-kasa-cta border border-kasa-gray-light bg-kasa-white lg:px-20 lg:py-20 px-4 py-8"
    >
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-center text-h1 font-bold text-kasa-red lg:flex lg:h-11.5 lg:items-center lg:justify-center">
          Heureux de vous revoir
        </h1>
        <p className="max-w-97.5 text-body font-normal text-black text-center">
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
      </div>
      <div className="flex flex-col gap-5.5 items-center">
        {error ? (
          <p
            role="alert"
            className="text-center text-body font-normal text-kasa-red"
          >
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          color="red"
          width="w-full"
          height="h-10"
          className="text-body font-medium text-kasa-white max-w-57.5 disabled:cursor-not-allowed disabled:opacity-60"
          size="medium"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Connexion…" : "Se connecter"}
        </Button>
        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/forgot-password"
            className="text-body font-normal text-kasa-red text-center"
          >
            Mot de passe oublié
          </Link>
          <p className="text-body font-normal text-kasa-red text-center">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-kasa-red font-medium">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};
