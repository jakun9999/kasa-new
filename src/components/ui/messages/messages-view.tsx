"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BackIcon } from "@/components/icons/back-icon";
import { MessageList } from "@/components/ui/messages/message-list";
import { MessagePane } from "@/components/ui/messages/message-pane";
import { MessageNew } from "@/components/ui/messages/message-new";
import {
  MOCK_CONVERSATIONS,
  MOCK_CURRENT_USER,
  MOCK_DEFAULT_CONVERSATION_ID,
} from "@/components/ui/messages/messages-mock";
import type { Conversation, PaneMessage } from "@/schemas/messages-schema";

function formatSentAt(date: Date): string {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
] as const;

function formatDateLabel(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  return `${d} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Shell messagerie (mocks sprint 1 — envoi réel = sprint 2).
 *
 * @remarks
 * - **Desktop** : liste + fil côte à côte.
 * - **Mobile** : soit la liste, soit le fil (`showThreadMobile`). Au passage liste→fil,
 *   focus sur « Retour » ; au retour, focus sur la ligne `aria-current` (WCAG 2.4.3).
 * - Données : {@link MOCK_CONVERSATIONS} — pas d’API messages encore.
 */
export function MessagesView() {
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_DEFAULT_CONVERSATION_ID,
  );
  /** Mobile uniquement : `true` = fil de la conversation sélectionnée. */
  const [showThreadMobile, setShowThreadMobile] = useState(false);
  /** Évite de voler le focus au premier montage. */
  const mobileViewChangedRef = useRef(false);
  const listRegionRef = useRef<HTMLElement>(null);
  const threadBackRef = useRef<HTMLButtonElement>(null);

  const listItems = useMemo(
    () =>
      conversations.map(
        ({
          id,
          correspondentName,
          correspondentPicture,
          lastMessagePreview,
          lastMessageAt,
          hasUnread,
        }) => ({
          id,
          correspondentName,
          correspondentPicture,
          lastMessagePreview,
          lastMessageAt,
          hasUnread,
        }),
      ),
    [conversations],
  );

  const selected = conversations.find((c) => c.id === selectedId);
  const messages: PaneMessage[] = selected?.messages ?? [];
  const threadTitle = selected
    ? `Conversation avec ${selected.correspondentName}`
    : "Conversation";

  useEffect(() => {
    if (!mobileViewChangedRef.current) {
      return;
    }
    if (showThreadMobile) {
      threadBackRef.current?.focus();
      return;
    }
    const selectedButton = listRegionRef.current?.querySelector(
      '[aria-current="true"]',
    );
    if (selectedButton instanceof HTMLElement) {
      selectedButton.focus();
    }
  }, [showThreadMobile]);

  function handleSelect(id: string) {
    mobileViewChangedRef.current = true;
    setSelectedId(id);
    setShowThreadMobile(true);
  }

  function handleBackToList() {
    mobileViewChangedRef.current = true;
    setShowThreadMobile(false);
  }

  function handleSend(content: string) {
    if (!selectedId) {
      return;
    }
    const now = new Date();
    const sentAt = formatSentAt(now);
    const nextMessage: PaneMessage = {
      id: `msg-local-${now.getTime()}`,
      from: "me",
      dateKey: formatDateKey(now),
      dateLabel: formatDateLabel(now),
      authorName: MOCK_CURRENT_USER.name,
      authorPicture: MOCK_CURRENT_USER.picture,
      sentAt,
      content,
    };

    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== selectedId) {
          return conversation;
        }
        return {
          ...conversation,
          lastMessagePreview: content,
          lastMessageAt: sentAt,
          hasUnread: false,
          messages: [...conversation.messages, nextMessage],
        };
      }),
    );
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-264.75 flex-1 flex-col overflow-hidden bg-kasa-white lg:rounded-kasa-cta lg:border lg:border-kasa-gray-light">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          ref={listRegionRef}
          aria-label="Liste des conversations"
          className={`min-h-0 w-full min-w-0 shrink-0 overflow-x-hidden overflow-y-auto lg:w-90 lg:border-r lg:border-kasa-gray-light ${
            showThreadMobile ? "hidden lg:block" : "block"
          }`}
        >
          <MessageList
            conversations={listItems}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </aside>

        <section
          aria-label={threadTitle}
          className={`flex min-h-0 min-w-0 flex-1 flex-col ${
            showThreadMobile ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="flex h-17 w-full shrink-0 items-center gap-3 bg-kasa-white px-2 lg:hidden">
            <Button
              ref={threadBackRef}
              type="button"
              size="medium"
              color="gray"
              width="w-[93px]"
              height="h-9"
              icon={<BackIcon />}
              className="text-body font-medium"
              onClick={handleBackToList}
            >
              Retour
            </Button>
            <h2 className="min-w-0 truncate text-body font-medium text-kasa-black">
              {selected?.correspondentName ?? "Messages"}
            </h2>
          </div>

          {/* Desktop : Figma sans bandeau titre — un seul h2 accessible (`sr-only`). */}
          <h2 className="sr-only max-lg:hidden">{threadTitle}</h2>

          <MessagePane
            key={selectedId ?? "empty"}
            messages={messages}
            conversationLabel={threadTitle}
          />
          <MessageNew onSend={handleSend} disabled={!selectedId} />
        </section>
      </div>
    </div>
  );
}
