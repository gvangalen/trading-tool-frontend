import { loadUserLocal } from "@/lib/user";

/**
 * Centraal ophalen van user_id uit saveUserLocal()
 * Dit is de enige bron die apiClient.ts mag gebruiken.
 */
export function getCurrentUserId(): number | null {
  const user = loadUserLocal();
  return user?.id ? Number(user.id) : null;
}
