import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialisation du mot de passe — bientôt disponible",
  robots: { index: false, follow: false },
};

/**
 * Stub sprint 1 : reset password = sprint 2.
 * Évite les 404 / prefetch Network depuis le formulaire de login.
 */
export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex w-full max-w-185.5 flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="text-h1 font-bold text-kasa-red">Mot de passe oublié</h1>
      <p className="max-w-97.5 text-body text-kasa-black">
        La réinitialisation du mot de passe sera branchée au sprint 2. Utilisez
        un compte de démo déjà créé sur l’API.
      </p>
      <Link href="/login">
        <Button size="long" color="red" className="font-medium">
          Retour à la connexion
        </Button>
      </Link>
    </main>
  );
}
