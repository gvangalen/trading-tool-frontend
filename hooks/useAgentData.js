import { useEffect, useState } from "react";

/**
 * useAgentData(category)
 *
 * Haalt op:
 *  - agent insights (samenvatting)
 *  - agent reflections (subfactoren)
 *
 * category: "macro" | "market" | "technical" | "setup" | "strategy"
 */
export function useAgentData(category) {
  const [insight, setInsight] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    async function load() {
      setLoading(true);

      console.log(
        `🧠 [useAgentData] Ophalen AI-insights & reflections voor categorie: ${category}`
      );

      try {
        // 🔥 Gebruik ALTIJD query params (correcte backend route)
        const insightRes = await fetch(
          `/api/agents/insights?category=${category}`
        );
        const reflectionsRes = await fetch(
          `/api/agents/reflections?category=${category}`
        );

        let ins = null;
        let refl = [];

        try {
          ins = await insightRes.json();
        } catch {
          console.warn("⚠️ Insight JSON niet leesbaar → null fallback");
          ins = null;
        }

        try {
          const parsed = await reflectionsRes.json();
          refl = Array.isArray(parsed) ? parsed : [];
        } catch {
          console.warn("⚠️ Reflections JSON niet leesbaar → lege lijst");
          refl = [];
        }

        setInsight(ins || null);
        setReflections(refl || []);
      } catch (err) {
        console.error("❌ [useAgentData] Fout bij ophalen:", err);
        setInsight(null);
        setReflections([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [category]);

  return {
    insight,       // hoofd AI-samenvatting
    reflections,   // subfactoren
    loading,
  };
}
