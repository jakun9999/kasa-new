"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BackIcon } from "@/components/icons/back-icon";
import { MessageListItem } from "@/components/ui/messages/message-list-item";
import type { MessageListConversation } from "@/schemas/messages-schema";
import { consumeMessagesBackToHome } from "@/lib/messages-back-navigation";

export type { MessageListConversation } from "@/schemas/messages-schema";

type MessageListProps = {
  conversations: MessageListConversation[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
};

/**
 * Colonne gauche messagerie : retour + titre + liste de conversations.
 * Mobile : pleine largeur, `py-6`. Desktop : `px-2 py-[11px]`, bandeau retour 360×68.
 */
export function MessageList({
  conversations,
  selectedId = null,
  onSelect,
  className = "",
}: MessageListProps) {
  const router = useRouter();
  const [listLoading, setListLoading] = useState(
    process.env.NODE_ENV === "development",
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }
    const timer = window.setTimeout(() => setListLoading(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  function handleBack() {
    // Post-login (`?next=/messages`) : l’historique pointe encore vers `/login`.
    if (consumeMessagesBackToHome()) {
      router.push("/");
      return;
    }
    router.back();
  }

  return (
    <div
      className={`min-w-0 overflow-x-hidden bg-kasa-white py-6 lg:px-2 lg:py-2.75 ${className}`.trim()}
      aria-busy={listLoading || undefined}
    >
      {listLoading ? (
        <p className="sr-only" aria-live="polite">
          Chargement des conversations…
        </p>
      ) : null}

      {/* Même inset gauche pour Retour et « Messages » (px-2.5 = padding des lignes). */}
      <div className="px-2.5">
        <div className="flex h-17 w-full items-center">
          <Button
            type="button"
            size="medium"
            color="gray"
            width="w-[93px]"
            height="h-9"
            icon={<BackIcon />}
            className="text-body font-medium"
            onClick={handleBack}
          >
            Retour
          </Button>
        </div>

        <div className="mt-1.75 flex min-w-0 flex-col">
          <h1 className="flex h-11.5 w-44.75 items-center justify-start text-h1 font-medium text-kasa-black">
            Messages
          </h1>
        </div>
      </div>

      <ul className="mt-4 flex w-full min-w-0 flex-col" role="list">
        {conversations.map((conversation) => {
          const { id, ...itemProps } = conversation;
          return (
            <li key={id} className="min-w-0">
              <MessageListItem
                {...itemProps}
                selected={selectedId === id}
                onClick={() => onSelect?.(id)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
