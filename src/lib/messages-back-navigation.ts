/** Marqueur session : arrivée sur `/messages` juste après login (évite Retour → `/login`). */
export const MESSAGES_BACK_HOME_KEY = "kasa:messages-back-home";

/** À appeler après login quand `next` pointe vers la messagerie. */
export function markMessagesArrivedFromLogin(): void {
  try {
    sessionStorage.setItem(MESSAGES_BACK_HOME_KEY, "1");
  } catch {
    /* sessionStorage indisponible */
  }
}

/**
 * Si le flag est présent, le consomme et indique d’aller à `/`
 * plutôt que `history.back()` (qui renverrait sur `/login`).
 */
export function consumeMessagesBackToHome(): boolean {
  try {
    if (sessionStorage.getItem(MESSAGES_BACK_HOME_KEY) === "1") {
      sessionStorage.removeItem(MESSAGES_BACK_HOME_KEY);
      return true;
    }
  } catch {
    /* sessionStorage indisponible */
  }
  return false;
}
