"use client";

import { StandardInput } from "@/components/ui/inputs/standard-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const LoginForm = () => {
  return (
    <form className="mx-auto flex w-full max-w-185.5 flex-col items-center gap-9.5 rounded-kasa-cta border border-kasa-gray-light bg-kasa-white lg:px-20 lg:py-20 px-4 py-8">
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
          placeholder="Votre email"
          label="Adresse email"
          id="email"
          width="w-full"
        />
        <StandardInput
          type="password"
          placeholder="Votre mot de passe"
          label="Mot de passe"
          id="password"
          width="w-full"
        />
      </div>
      <div className="flex flex-col gap-5.5 items-center">
        <Button
          type="submit"
          color="red"
          width="w-full"
          height="h-10"
          className="text-body font-medium text-kasa-white max-w-57.5"
          size="medium"
        >
          Se connecter
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
