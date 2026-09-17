/** Jusqu’à 4 miniatures : les photos **suivantes**, sans la photo affichée en grand. */
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
    // Boucle circulaire : après la dernière photo, on reprend à 0.
    return (currentIndex + offset + 1) % count;
  });
}

/**
 * Assemble cover + pictures pour le carrousel (brief : galerie fiche).
 * Ignore les URLs vides et les doublons (cover souvent déjà dans `pictures`).
 */
export function buildPropertyImages(
  cover: string | null | undefined,
  pictures: string[] | null | undefined,
): string[] {
  return [cover, ...(pictures ?? [])].filter(
    (src, index, list): src is string =>
      Boolean(src) && list.indexOf(src) === index,
  );
}
