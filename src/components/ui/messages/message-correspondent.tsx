import Image from "next/image";

export type MessageCorrespondentProps = {
  correspondentName: string;
  correspondentPicture?: string | null;
  /** Heure déjà formatée (ex. `11:04pm`), sans date. */
  sentAt: string;
  content: string;
  className?: string;
};

/**
 * Bulle d’un message reçu du correspondant (avatar + méta + texte).
 */
export function MessageCorrespondent({
  correspondentName,
  correspondentPicture,
  sentAt,
  content,
  className = "",
}: MessageCorrespondentProps) {
  return (
    <div
      className={`flex w-full max-w-full flex-row gap-1.5 ${className}`.trim()}
    >
      <div className="relative size-7 shrink-0 self-start overflow-hidden rounded-md bg-kasa-gray-dark">
        {correspondentPicture ? (
          <Image
            src={correspondentPicture}
            alt=""
            width={28}
            height={28}
            className="size-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex h-2.75 flex-row items-center gap-1">
          <span className="flex h-full items-center text-micro font-normal text-kasa-gray-dark">
            {correspondentName}
          </span>
          <span
            className="size-1 shrink-0 rounded-full bg-kasa-gray-dark"
            aria-hidden
          />
          <time
            lang={/\b(am|pm)\b/i.test(sentAt) ? "en" : undefined}
            className="flex h-full items-center text-micro font-normal text-kasa-gray-dark"
          >
            {sentAt}
          </time>
        </div>

        <div className="max-w-68.25 rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] rounded-tl-none border border-kasa-gray-light bg-kasa-white p-3">
          <p className="text-overline font-normal text-kasa-black">{content}</p>
        </div>
      </div>
    </div>
  );
}
