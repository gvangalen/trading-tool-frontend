import apiClient from "./apiClient";

/**
 * 🔍 Haal onboarding-status op voor de huidige gebruiker
 * Return:
 * {
 *   setup: true/false,
 *   technical: true/false,
 *   macro: true/false,
 *   market: true/false,
 *   strategy: true/false,
 *   completed: true/false
 * }
 */
export async function getOnboardingStatus() {
  const response = await apiClient.get("/onboarding/status");
  return response.data;
}

/**
 * ✔ Markeer een stap als voltooid
 * Voorbeeld:
 * completeOnboardingStep("setup")
 */
export async function completeOnboardingStep(step) {
  const response = await apiClient.post("/onboarding/complete_step", {
    step,
  });
  return response.data;
}

/**
 * 🚀 Markeer onboarding volledig voltooid
 */
export async function finishOnboarding() {
  const response = await apiClient.post("/onboarding/finish");
  return response.data;
}

/**
 * 🔄 Reset (alleen voor testen / dev)
 */
export async function resetOnboarding() {
  const response = await apiClient.post("/onboarding/reset");
  return response.data;
}
