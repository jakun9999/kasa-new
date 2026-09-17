"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type MessageListItemProps = {
  /** Nom du correspondant. */
  correspondentName: string;
  /** Photo du correspondant. */
  correspondentPicture?: string | null;
  /** Aperçu du dernier message. */
  lastMessagePreview: string;
  /** Heure déjà formatée (ex. `11:04 am`). */
  lastMessageAt: string;
  /** Au moins un message non lu du correspondant. */
  hasUnread?: boolean;
  /** Ligne active dans la liste. */
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

const skeletonStatic = "bg-kasa-gray-dark/25";
const skeletonPulse = `animate-pulse ${skeletonStatic}`;

function timeLang(value: string): "en" | undefined {
  return /\b(am|pm)\b/i.test(value) ? "en" : undefined;
}

/**
 * Placeholder Figma (photo + lignes de texte) pendant le chargement.
 */
export function MessageListItemSkeleton({
  selected = false,
  className = "",
}: {
  selected?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex h-[61.05px] w-full items-center border-b border-kasa-gray-light px-2.5 ${
        selected ? "bg-kasa-cream" : "bg-kasa-white"
      } ${className}`.trim()}
    >
      <div
        className={`h-[45.05px] w-[44.5px] shrink-0 rounded-[5.49px] ${skeletonPulse}`}
      />
      <div className="ml-5 flex min-w-0 flex-1 flex-col items-start gap-1">
        <div
          className={`h-3.5 w-28 max-w-full rounded-kasa-short ${skeletonPulse}`}
        />
        <div
          className={`h-2.5 w-full max-w-47.5 rounded-kasa-short ${skeletonPulse}`}
        />
      </div>
      <div className="ml-auto flex h-8.25 w-10.5 shrink-0 flex-col items-end justify-between">
        <div className={`h-2.5 w-10 rounded-kasa-short ${skeletonPulse}`} />
        <div className={`size-1.5 rounded-full ${skeletonPulse}`} />
      </div>
    </div>
  );
}

/**
 * Ligne de conversation (liste messagerie).
 * En `next dev`, skeleton 2 s pour la démo soutenance ; pulse photo plafonné à 5 s (2.2.2).
 */
export function MessageListItem({
  correspondentName,
  correspondentPicture,
  lastMessagePreview,
  lastMessageAt,
  hasUnread = false,
  selected = false,
  onClick,
  className = "",
}: MessageListItemProps) {
  const [devReady, setDevReady] = useState(
    process.env.NODE_ENV !== "development",
  );
  const [loadedPicture, setLoadedPicture] = useState<string | null>(null);
  const [photoPulse, setPhotoPulse] = useState(true);
  const imageLoaded =
    !correspondentPicture || loadedPicture === correspondentPicture;

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }
    const timer = window.setTimeout(() => setDevReady(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      setPhotoPulse(false);
      return;
    }
    setPhotoPulse(true);
    const timer = window.setTimeout(() => setPhotoPulse(false), 5000);
    return () => window.clearTimeout(timer);
  }, [imageLoaded, correspondentPicture]);

  if (!devReady) {
    return (
      <MessageListItemSkeleton selected={selected} className={className} />
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      className={`flex h-[61.05px] w-full min-w-0 cursor-pointer items-center border-b border-kasa-gray-light px-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kasa-red ${
        selected ? "bg-kasa-cream" : "bg-kasa-white"
      } ${className}`.trim()}
    >
      <div className="relative h-[45.05px] w-[44.5px] shrink-0 self-center overflow-hidden rounded-[5.49px] bg-kasa-gray-light">
        {!imageLoaded ? (
          <div
            className={`absolute inset-0 ${photoPulse ? skeletonPulse : skeletonStatic}`}
          />
        ) : null}
        {correspondentPicture ? (
          <Image
            src={correspondentPicture}
            alt=""
            width={45}
            height={45}
            className="h-full w-full object-cover"
            onLoad={() => setLoadedPicture(correspondentPicture)}
          />
        ) : null}
      </div>

      <div className="ml-5 flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className="w-full truncate text-body font-medium text-kasa-black">
          {correspondentName}
        </p>
        <p className="w-full max-w-47.5 truncate text-overline font-normal text-kasa-gray-dark">
          {lastMessagePreview}
        </p>
      </div>

      <div className="relative ml-auto flex h-8.25 w-10.5 shrink-0 flex-col items-end">
        <time
          lang={timeLang(lastMessageAt)}
          className="text-overline font-normal text-kasa-black"
        >
          {lastMessageAt}
        </time>
        {hasUnread ? (
          <span
            className="absolute right-0 bottom-0 size-1.5 rounded-full bg-kasa-red"
            aria-label="Message non lu"
          />
        ) : null}
      </div>
    </button>
  );
}
