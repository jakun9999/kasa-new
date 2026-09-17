import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Création de compte Kasa — bientôt disponible",
  robots: { index: false, follow: false },
};

/**
 * Stub sprint 1 : l’inscription réelle est prévue au sprint 2.
 * Évite les 404 / prefetch Network sur le lien « Inscrivez-vous » du login.
 */
export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-185.5 flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="text-h1 font-bold text-kasa-red">Inscription</h1>
      <p className="max-w-97.5 text-body text-kasa-black">
        La création de compte arrive au sprint 2. En attendant, connectez-vous
        avec un compte déjà présent sur l’API Kasa.
      </p>
      <Link href="/login">
        <Button size="long" color="red" className="font-medium">
          Retour à la connexion
        </Button>
      </Link>
    </main>
  );
}
