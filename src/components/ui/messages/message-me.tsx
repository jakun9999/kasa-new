import Image from "next/image";

export type MessageMeProps = {
  correspondentName: string;
  correspondentPicture?: string | null;
  /** Heure déjà formatée (ex. `11:04pm`), sans date. */
  sentAt: string;
  content: string;
  className?: string;
};

/**
 * Bulle d’un message envoyé par l’utilisateur connecté (méta + texte + avatar à droite).
 */
export function MessageMe({
  correspondentName,
  correspondentPicture,
  sentAt,
  content,
  className = "",
}: MessageMeProps) {
  return (
    <div
      className={`flex w-full max-w-full flex-row justify-end gap-1.5 ${className}`.trim()}
    >
      <div className="flex min-w-0 flex-col items-end gap-2">
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

        <div className="max-w-68.25 rounded-tl-[20px] rounded-br-[20px] rounded-bl-[20px] rounded-tr-none bg-kasa-red-dark p-3">
          <p className="text-overline font-normal text-kasa-white">{content}</p>
        </div>
      </div>

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
    </div>
  );
}
