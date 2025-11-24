import { fetchWithRetry } from "@/lib/utils/fetchWithRetry";
import { API_BASE_URL } from "@/lib/config";

//
// 🧠 AI AGENTS – CATEGORY INSIGHTS
//

/**
 * 📡 Haal de meest recente AI-inzichten voor 1 categorie op
 * categorie kan zijn:
 *  - macro
 *  - market
 *  - technical
 *  - setup
 */
export const fetchAgentInsight = async (category) => {
  if (!category) {
    console.warn("⚠️ [fetchAgentInsight] Geen category meegegeven.");
    return null;
  }

  console.log(
    `📡 [fetchAgentInsight] Ophalen van /api/agents/insights?category=${category}`
  );

  const url = `${API_BASE_URL}/api/agents/insights?category=${category}`;

  try {
    const data = await fetchWithRetry(url, "GET");
    console.log("📥 [fetchAgentInsight] Gegevens ontvangen:", data);
    return data?.insight || null;
  } catch (err) {
    console.error("❌ [fetchAgentInsight] Fout:", err);
    return null;
  }
};

//
// 🧠 AI REFLECTIONS – optioneel voor subfactoren
//
export const fetchAgentReflections = async (category) => {
  if (!category) {
    console.warn("⚠️ [fetchAgentReflections] Geen category meegegeven.");
    return [];
  }

  console.log(
    `📡 [fetchAgentReflections] Ophalen van /api/agents/reflections?category=${category}`
  );

  const url = `${API_BASE_URL}/api/agents/reflections?category=${category}`;

  try {
    const data = await fetchWithRetry(url, "GET");
    console.log("📥 [fetchAgentReflections] Reflecties ontvangen:", data);
    return data?.reflections || [];
  } catch (err) {
    console.error("❌ [fetchAgentReflections] Fout:", err);
    return [];
  }
};
