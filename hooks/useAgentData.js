import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export function useAgentData(category) {
  const [insight, setInsight] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  async function safeJson(res) {
    if (!res || !res.ok) return null;

    try {
      return await res.json();
    } catch (e) {
      console.warn("⚠️ JSON parse mislukt → fallback null");
      return null;
    }
  }

  useEffect(() => {
    if (!category) return;

    async function load() {
      setLoading(true);

      console.log(`🧠 [useAgentData] Load AI-data for: ${category}`);

      try {
        // 👉 FIXED: juiste backend URL
        const insightRes = await fetch(
          `${API_BASE_URL}/api/agents/insights?category=${category}`
        );

        const reflectionsRes = await fetch(
          `${API_BASE_URL}/api/agents/reflections?category=${category}`
        );

        const ins = await safeJson(insightRes);
        const refl = await safeJson(reflectionsRes);

        setInsight(ins?.insight || null);
        setReflections(refl?.reflections || []);
      } catch (err) {
        console.error("❌ [useAgentData] Fout:", err);
        setInsight(null);
        setReflections([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [category]);

  return {
    insight,
    reflections,
    loading,
  };
}
