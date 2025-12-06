import { loadUserLocal } from "@/lib/user";

/**
 * Nieuwe, uniforme manier om user_id op te halen
 * uit dezelfde storage die apiLogin() gebruikt.
 */
export function getCurrentUserId(): number | null {
  const user = loadUserLocal();
  return user?.id ? Number(user.id) : null;
}

/**
 * Niet meer nodig — user wordt opgeslagen via saveUserLocal
 */
export function setCurrentUserId(id: number) {
  console.warn("setCurrentUserId() is deprecated — gebruik saveUserLocal()");
}

/**
 * Niet meer nodig — logout gebruikt clearUserLocal()
 */
export function clearCurrentUserId() {
  console.warn("clearCurrentUserId() is deprecated — gebruik clearUserLocal()");
}
