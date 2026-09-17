"use client";

import { useEffect, useState } from "react";
import { MessageCorrespondent } from "@/components/ui/messages/message-correspondent";
import { MessageMe } from "@/components/ui/messages/message-me";
import type { PaneMessage } from "@/schemas/messages-schema";

export type { PaneMessage } from "@/schemas/messages-schema";

type MessagePaneProps = {
  messages: PaneMessage[];
  /** Nom accessible du fil (landmark / log). */
  conversationLabel?: string;
  className?: string;
};

type TimelineEntry =
  | { kind: "date"; key: string; label: string }
  | { kind: "message"; message: PaneMessage };

const skeletonFill = "animate-pulse bg-kasa-gray-dark/25";

function buildTimeline(messages: PaneMessage[]): TimelineEntry[] {
  const timeline: TimelineEntry[] = [];
  let lastDateKey: string | null = null;

  for (const message of messages) {
    if (message.dateKey !== lastDateKey) {
      timeline.push({
        kind: "date",
        key: message.dateKey,
        label: message.dateLabel,
      });
      lastDateKey = message.dateKey;
    }
    timeline.push({ kind: "message", message });
  }

  return timeline;
}

function marginBefore(
  previous: TimelineEntry | undefined,
  current: TimelineEntry,
): string {
  if (!previous) {
    return "";
  }
  if (previous.kind === "date" || current.kind === "date") {
    return "mt-6";
  }
  if (
    previous.message.from === "correspondent" &&
    current.message.from === "correspondent"
  ) {
    return "mt-10";
  }
  return "mt-6";
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center gap-2" role="separator">
      <div
        className="h-[0.5px] min-w-0 flex-1 bg-kasa-gray-dark"
        aria-hidden
      />
      <time className="shrink-0 text-micro font-normal text-kasa-gray-dark">
        {label}
      </time>
      <div
        className="h-[0.5px] min-w-0 flex-1 bg-kasa-gray-dark"
        aria-hidden
      />
    </div>
  );
}

function MessageBubbleSkeleton({ align }: { align: "start" | "end" }) {
  const isMe = align === "end";

  return (
    <div
      className={`flex w-full max-w-full flex-row gap-1.5 ${
        isMe ? "justify-end" : ""
      }`}
    >
      {!isMe ? (
        <div className={`size-7 shrink-0 rounded-md ${skeletonFill}`} />
      ) : null}

      <div
        className={`flex min-w-0 flex-col gap-2 ${isMe ? "items-end" : ""}`}
      >
        <div className={`h-2.75 w-28 rounded-kasa-short ${skeletonFill}`} />
        <div
          className={`h-16 w-48 max-w-68.25 rounded-[20px] p-3 sm:w-60 ${
            isMe
              ? "rounded-tr-none bg-kasa-red-dark/30"
              : "rounded-tl-none border border-kasa-gray-light bg-kasa-white"
          }`}
        >
          <div className={`h-2.5 w-full rounded-kasa-short ${skeletonFill}`} />
          <div
            className={`mt-2 h-2.5 w-3/4 rounded-kasa-short ${skeletonFill}`}
          />
        </div>
      </div>

      {isMe ? (
        <div className={`size-7 shrink-0 rounded-md ${skeletonFill}`} />
      ) : null}
    </div>
  );
}

/** Visuel skeleton uniquement (`aria-hidden`) — le statut est porté par le parent. */
export function MessagePaneSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`min-h-0 flex-1 overflow-y-auto bg-kasa-cream px-2 py-10 lg:px-10.5 ${className}`.trim()}
    >
      <div className="flex flex-col">
        <MessageBubbleSkeleton align="start" />
        <div className="mt-10">
          <MessageBubbleSkeleton align="start" />
        </div>
        <div className="mt-6 flex w-full items-center gap-2">
          <div className="h-[0.5px] min-w-0 flex-1 bg-kasa-gray-dark/40" />
          <div className={`h-2 w-24 rounded-kasa-short ${skeletonFill}`} />
          <div className="h-[0.5px] min-w-0 flex-1 bg-kasa-gray-dark/40" />
        </div>
        <div className="mt-6">
          <MessageBubbleSkeleton align="end" />
        </div>
        <div className="mt-6">
          <MessageBubbleSkeleton align="start" />
        </div>
        <div className="mt-6">
          <MessageBubbleSkeleton align="end" />
        </div>
      </div>
    </div>
  );
}

/**
 * Fil de conversation scrollable (focusable pour le clavier — WCAG 2.1.1).
 * En `next dev`, skeleton 2 s + annonce polie (comme la liste).
 */
export function MessagePane({
  messages,
  conversationLabel = "Conversation",
  className = "",
}: MessagePaneProps) {
  const [devReady, setDevReady] = useState(
    process.env.NODE_ENV !== "development",
  );
  const timeline = buildTimeline(messages);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }
    const timer = window.setTimeout(() => setDevReady(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  const shellClass = `min-h-0 flex-1 overflow-y-auto bg-kasa-cream px-2 py-10 lg:px-10.5 ${className}`.trim();

  if (!devReady) {
    return (
      <div
        className={shellClass}
        aria-busy="true"
        aria-live="polite"
        aria-label={conversationLabel}
      >
        <p className="sr-only">Chargement de la conversation…</p>
        <MessagePaneSkeleton />
      </div>
    );
  }

  return (
    <div
      className={shellClass}
      role="log"
      tabIndex={0}
      aria-label={conversationLabel}
      aria-relevant="additions"
      aria-busy="false"
    >
      <div className="flex flex-col">
        {timeline.length === 0 ? (
          <p className="text-caption font-normal text-kasa-gray-dark">
            Aucun message dans cette conversation.
          </p>
        ) : (
          timeline.map((entry, index) => {
            const previous = timeline[index - 1];
            const spacing = marginBefore(previous, entry);

            if (entry.kind === "date") {
              return (
                <div key={`date-${entry.key}`} className={spacing}>
                  <DateSeparator label={entry.label} />
                </div>
              );
            }

            const { message } = entry;
            return (
              <div key={message.id} className={spacing}>
                {message.from === "correspondent" ? (
                  <MessageCorrespondent
                    correspondentName={message.authorName}
                    correspondentPicture={message.authorPicture}
                    sentAt={message.sentAt}
                    content={message.content}
                  />
                ) : (
                  <MessageMe
                    correspondentName={message.authorName}
                    correspondentPicture={message.authorPicture}
                    sentAt={message.sentAt}
                    content={message.content}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
