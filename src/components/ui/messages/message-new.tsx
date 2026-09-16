"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useId,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { SendIcon } from "@/components/icons/send-icon";

export type MessageNewProps = {
  /** Valeur contrôlée (sinon non contrôlé via `defaultValue`). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Appelé avec le texte trimé ; le champ est vidé après envoi. */
  onSend?: (message: string) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * Barre de composition messagerie (Figma) : fond gris, champ + CTA short rouge.
 * Emprise : 390×86 (mobile) / 683×137 (desktop) — largeur fluide `w-full`, hauteurs figées.
 * Mobile = 1 ligne ; desktop = multiligne sans scroll (`overflow-hidden`).
 */
export function MessageNew({
  value: valueProp,
  defaultValue = "",
  onChange,
  onSend,
  disabled = false,
  className = "",
}: MessageNewProps) {
  const inputId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolled;

  function setValue(next: string) {
    if (!isControlled) {
      setUncontrolled(next);
    }
    onChange?.(next);
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
  }

  function submitMessage() {
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }
    onSend?.(trimmed);
    setValue("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage();
  }

  /**
   * Mobile (`lg` non atteint) : Enter envoie, pas de retour ligne.
   * Desktop : Enter = nouvelle ligne ; envoi via le bouton.
   */
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) {
      event.preventDefault();
      submitMessage();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`box-border h-21.5 w-full bg-kasa-white px-7.5 py-5.25 lg:h-34.25 ${className}`.trim()}
    >
      <div className="relative h-11 w-full lg:h-23.75">
        <label htmlFor={inputId} className="sr-only">
          Envoyer un message
        </label>

        <textarea
          id={inputId}
          name="message"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Envoyer un message"
          disabled={disabled}
          rows={1}
          className="box-border h-full w-full resize-none overflow-hidden rounded-kasa-cta border border-kasa-gray-light bg-kasa-white pt-3.5 pr-14 pb-3.25 pl-3.75 text-caption font-normal whitespace-nowrap text-kasa-gray-dark placeholder:font-light placeholder:text-kasa-gray-dark/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kasa-red lg:pt-4 lg:pr-15.5 lg:pb-4 lg:pl-4 lg:whitespace-pre-wrap lg:wrap-break-wordbreak-words"
        />

        <Button
          type="submit"
          size="short"
          color="red"
          icon={<SendIcon />}
          aria-label="Envoyer le message"
          disabled={disabled || value.trim().length === 0}
          className="absolute top-1/2 right-2.25 -translate-y-1/2 lg:top-auto lg:right-3.5 lg:bottom-2 lg:translate-y-0"
        />
      </div>
    </form>
  );
}
