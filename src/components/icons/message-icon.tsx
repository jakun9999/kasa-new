type MessageIconProps = {
  className?: string;
  /** Fill / stroke du path. Sans `stroke-*`, `strokeWidth` est invisible. */
  pathClassName?: string;
};

/**
 * Bulle Figma (`figma-export/icons/message_icon.svg`).
 * Contour = stroke 0,9 (comme `FavoriteIcon`), pas le trou du path d’export.
 */
export function MessageIcon({
  className = "size-4",
  pathClassName = "fill-currentColor",
}: MessageIconProps) {
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
        d="M12.2461 3.72095C12.7445 3.72111 13.1502 4.12685 13.1504 4.62524V9.93286C13.1502 10.4313 12.7445 10.837 12.2461 10.8372H6.8584L5.44727 12.1125C5.32745 12.2209 5.17586 12.2785 5.02051 12.2786C4.93188 12.2786 4.84272 12.2601 4.75879 12.2229C4.52544 12.1189 4.37876 11.8938 4.37891 11.6379V10.8372H3.75488C3.25617 10.8372 2.84975 10.4314 2.84961 9.93286V4.62524C2.84977 4.12672 3.25619 3.72095 3.75488 3.72095H12.2461Z"
        className={pathClassName}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
    </svg>
  );
}
