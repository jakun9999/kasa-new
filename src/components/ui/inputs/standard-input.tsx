import type { InputHTMLAttributes } from "react";

export type StandardInputType = "text" | "email" | "password";

type StandardInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "id" | "width"
> & {
  label: string;
  id: string;
  type: StandardInputType;
  /** Classe Tailwind de largeur (wrapper label + champ). Défaut : `w-full`. */
  width?: string;
};

/**
 * Champ texte / email / mot de passe : label lié via `htmlFor`,
 * hauteur 40px, écart 4px, typo caption (12px).
 */
export function StandardInput({
  label,
  placeholder,
  id,
  type,
  width = "w-full",
  className = "",
  ...rest
}: StandardInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${width}`}>
      <label htmlFor={id} className="text-body font-medium text-kasa-black">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`box-border h-10 w-full border border-kasa-gray-light bg-kasa-white px-2.5 rounded-sm text-caption font-normal text-kasa-gray-dark placeholder:font-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kasa-red ${className}`.trim()}
        {...rest}
      />
    </div>
  );
}
