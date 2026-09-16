"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useAuth } from "@/context/auth-context";

type MessagesLinkProps = Omit<ComponentProps<typeof Link>, "href">;

/**
 * Lien vers la messagerie : `/messages` si connecté, sinon `/login?next=/messages`.
 * La route `/messages` redirige aussi côté serveur (garde cookie JWT).
 */
export function MessagesLink({ children, ...rest }: MessagesLinkProps) {
  const { authUser, isReady } = useAuth();
  const href =
    isReady && !authUser ? "/login?next=/messages" : "/messages";

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
