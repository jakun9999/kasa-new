"use client";

import { Button } from "@/components/ui/button";
import { MessagesLink } from "@/components/ui/auth/messages-link";

/**
 * CTA fiche logement → messagerie (ou login si visiteur).
 */
export function PropertyContactActions() {
  return (
    <>
      <MessagesLink className="block w-fit max-w-full">
        <Button
          size="long"
          color="red"
          width="w-74.25"
          height="h-9"
          className="font-medium text-body shrink-0"
        >
          Contacter l&apos;hôte
        </Button>
      </MessagesLink>
      <MessagesLink className="block w-fit max-w-full">
        <Button
          size="long"
          color="red"
          width="w-74.25"
          height="h-9"
          className="font-medium text-body shrink-0"
        >
          Envoyer un message
        </Button>
      </MessagesLink>
    </>
  );
}
