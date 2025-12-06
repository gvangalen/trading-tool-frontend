// -----------------------------------------------------
// lib/user.ts
// -----------------------------------------------------

/**
 * Waar we de ingelogde user opslaan in localStorage
 * via apiLogin() of apiMe()
 */
const LOCAL_USER_KEY = "tt_current_user";

/**
 * User lokaal opslaan
 */
export function saveUserLocal(user: any) {
  if (!user) return;
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

/**
 * User laden uit localStorage
 */
export function loadUserLocal() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(LOCAL_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * User verwijderen (logout)
 */
export function clearUserLocal() {
  localStorage.removeItem(LOCAL_USER_KEY);
}

/**
 * Belangrijk: user_id ophalen voor API calls
 */
export function getCurrentUserId(): number | null {
  const user = loadUserLocal();
  return user?.id ? Number(user.id) : null;
}
