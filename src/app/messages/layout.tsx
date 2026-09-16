import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionToken } from "@/lib/api-server";

/**
 * Messagerie réservée aux utilisateurs authentifiés (cookie JWT HttpOnly).
 * Visiteur → `/login?next=/messages`.
 *
 * Mobile : annule le `px-4` + `gap-10` du layout racine (plein écran sous le header,
 * collé au footer) — Figma n’a pas ces gouttières.
 */
export default async function MessagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login?next=/messages");
  }

  return (
    <div className="-mx-4 -mt-10 -mb-10 flex min-h-0 w-[calc(100%+2rem)] flex-1 flex-col lg:mx-0 lg:mt-0 lg:mb-0 lg:w-full">
      {children}
    </div>
  );
}
