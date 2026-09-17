"use client";

import { MessagesLink } from "@/components/ui/auth/messages-link";

/** Apparence CTA long rouge (miroir de `Button`) sans imbriquer un `<button>` dans un lien. */
const contactCtaClass =
  "box-border inline-flex h-9 w-74.25 max-w-full shrink-0 items-center justify-center gap-1 overflow-hidden rounded-kasa-cta bg-kasa-red px-8 text-body font-medium whitespace-nowrap text-kasa-white ring-1 ring-inset ring-kasa-white transition-colors hover:bg-kasa-red-dark active:bg-kasa-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kasa-black";

/**
 * CTA fiche logement → messagerie (ou login si visiteur).
 * Un seul contrôle interactif par CTA (WCAG 4.1.2 — pas de Link > Button).
 */
export function PropertyContactActions() {
  return (
    <>
      <MessagesLink className={contactCtaClass}>
        Contacter l&apos;hôte
      </MessagesLink>
      <MessagesLink className={contactCtaClass}>
        Envoyer un message
      </MessagesLink>
    </>
  );
}
