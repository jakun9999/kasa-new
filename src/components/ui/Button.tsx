import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonColor = "red" | "gray";
export type ButtonSize = "short" | "medium" | "long";

type ButtonBase = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "color"
> & {
  color: ButtonColor;
  /** Classe Tailwind de largeur. Défaut : `w-8` (short) ou `w-fit` (medium/long). */
  width?: string;
  /** Classe Tailwind de hauteur. Défaut : `h-8` (short) ou `h-fit` (medium/long). */
  height?: string;
};

type ShortButtonProps = ButtonBase & {
  size: "short";
  icon: ReactNode;
  children?: never;
  "aria-label": string;
};

type HugButtonProps = ButtonBase & {
  size: "medium" | "long";
  icon?: ReactNode;
  children: ReactNode;
};

export type ButtonProps = ShortButtonProps | HugButtonProps;

const colorClass: Record<ButtonColor, string> = {
  red: "bg-kasa-red text-kasa-white ring-1 ring-inset ring-kasa-white hover:bg-kasa-red-dark active:bg-kasa-red-dark",
  gray: "bg-kasa-gray-light text-kasa-gray-dark",
};

const sizeClass: Record<ButtonSize, string> = {
  short: "rounded-kasa-short",
  medium: "gap-0 rounded-kasa-cta",
  long: "gap-1 rounded-kasa-cta",
};

const sizePadding: Record<ButtonSize, string> = {
  short: "p-0",
  medium: "px-4 py-2",
  long: "px-8 py-2",
};

const defaultWidth: Record<ButtonSize, string> = {
  short: "w-8",
  medium: "w-fit",
  long: "w-fit",
};

const defaultHeight: Record<ButtonSize, string> = {
  short: "h-8",
  medium: "h-fit",
  long: "h-fit",
};

const baseClass =
  "box-border inline-flex items-center justify-center overflow-hidden whitespace-nowrap text-body font-medium cursor-pointer transition-colors [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kasa-black";

/**
 * CTA Kasa : 3 variants Figma (`size`) × 2 couleurs.
 * `width` / `height` optionnels : classes Tailwind qui remplacent le hug / 32×32
 * et désactivent le padding du variant (sinon `px-8` empêche un `w-12.5`).
 */
export function Button({
  size,
  color,
  icon,
  width,
  height,
  className = "",
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  const hasExplicitBox = Boolean(width || height);

  return (
    <button
      type={type}
      className={`${baseClass} ${colorClass[color]} ${sizeClass[size]} ${hasExplicitBox ? "min-w-0 min-h-0 p-0" : sizePadding[size]} ${width ?? defaultWidth[size]} ${height ?? defaultHeight[size]} ${className}`.trim()}
      {...rest}
    >
      {icon}
      {size === "short" ? null : children}
    </button>
  );
}
