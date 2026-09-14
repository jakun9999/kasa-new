/** Jusqu’à 4 miniatures : les photos suivantes, sans la photo affichée en grand. */
export function getThumbnailIndices(
  currentIndex: number,
  count: number,
  maxThumbnails = 4,
): number[] {
  if (count <= 1) {
    return [];
  }

  const slots = Math.min(maxThumbnails, count - 1);
  return Array.from({ length: slots }, (_, offset) => {
    return (currentIndex + offset + 1) % count;
  });
}

/** Cover + pictures, sans doublon ni URL vide. */
export function buildPropertyImages(
  cover: string | null | undefined,
  pictures: string[] | null | undefined,
): string[] {
  return [cover, ...(pictures ?? [])].filter(
    (src, index, list): src is string =>
      Boolean(src) && list.indexOf(src) === index,
  );
}
