const USER_KEY = "current_user_id";

/**
 * Slaat de user_id op in localStorage (voor API-calls)
 */
export function setCurrentUserId(id: number | string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, String(id));
}

/**
 * Leest de user_id uit localStorage
 */
export function getCurrentUserId(): number | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(USER_KEY);
  if (!val) return null;
  return Number(val);
}

/**
 * Verwijdert de user_id (logout, session verlopen…)
 */
export function clearCurrentUserId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}
