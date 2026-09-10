import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonColor = "red" | "gray";
export type ButtonSize = "short" | "medium" | "long";

type ButtonBase = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "color"
> & {
  color: ButtonColor;
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
  short: "h-8 w-8 rounded-kasa-short p-0",
  medium: "h-fit w-fit gap-0 rounded-kasa-cta px-4 py-2",
  long: "h-fit w-fit gap-2.5 rounded-kasa-cta px-8 py-2",
};

const baseClass =
  "inline-flex items-center justify-center overflow-hidden whitespace-nowrap text-body font-medium cursor-pointer transition-colors [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kasa-black";

/**
 * CTA Kasa : 3 tailles × 2 couleurs de départ (rouge clair / gris).
 * Le rouge foncé n’est jamais l’état initial : c’est le hover/active du rouge.
 * Short = 32×32 icône seule. Medium/long = largeur hug (`w-fit`).
 */
export function Button({
  size,
  color,
  icon,
  className = "",
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${baseClass} ${colorClass[color]} ${sizeClass[size]} ${className}`.trim()}
      {...rest}
    >
      {icon}
      {size === "short" ? null : children}
    </button>
  );
}
