type FavoriteIconProps = {
  className?: string;
};

/**
 * Cœur Figma (`favori_icon.svg`).
 * Repos : fill Gris dark. Hover du bouton (`group`) : fill rouge light.
 * Contour Gris light dans les deux états.
 */
export function FavoriteIcon({ className = "size-4" }: FavoriteIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M3.2002 6.28595C3.2002 9.97795 8.0002 12.4579 8.0002 12.4579C8.0002 12.4579 12.8002 9.97995 12.8002 6.28595C12.8002 4.77195 11.5722 3.54395 10.0582 3.54395C9.2342 3.54395 8.5042 3.91395 8.0002 4.48995C7.4982 3.91395 6.7662 3.54395 5.9422 3.54395C4.4282 3.54195 3.2002 4.76995 3.2002 6.28595Z"
        className="fill-kasa-gray-dark stroke-kasa-gray-light transition-colors group-hover:fill-kasa-red-light ease-in-out duration-300"
        strokeWidth={0.9}
      />
    </svg>
  );
}
