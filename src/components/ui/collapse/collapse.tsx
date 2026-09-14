"use client";

import { useId, useState, type ReactNode } from "react";
import { BottomArrowIcon } from "@/components/icons/bottom-arrow-icon";

type CollapseProps = {
  title: string;
  children: ReactNode;
  /** Ouvert au premier rendu (défaut : ouvert). */
  defaultOpen?: boolean;
  className?: string;
};

/**
 * Panneau repliable : clic sur l’en-tête, animation discrète (300 ms).
 * `aria-expanded` sur le bouton ; panneau lié via `aria-controls`.
 */
export function Collapse({
  title,
  children,
  defaultOpen = true,
  className = "",
}: CollapseProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className={`flex flex-col gap-4 ${className}`.trim()}>
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-2 text-left text-[14px] font-medium text-kasa-black"
        onClick={() => setOpen((current) => !current)}
      >
        {title}
        <BottomArrowIcon
          className={`h-2.5 w-4.25 shrink-0 text-kasa-black transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
