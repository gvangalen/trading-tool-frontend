import { useEffect, useState } from "react";

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
        const insightRes = await fetch(`/api/agents/insights?category=${category}`);
        const reflectionsRes = await fetch(`/api/agents/reflections?category=${category}`);

        // ✔️ JSON veilig parsen (nooit crash)
        const ins = await safeJson(insightRes);
        const refl = await safeJson(reflectionsRes);

        // ✔️ Correcte fallbacks
        setInsight(ins && typeof ins === "object" ? ins : null);
        setReflections(Array.isArray(refl) ? refl : []);

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
