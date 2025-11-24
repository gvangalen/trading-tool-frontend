import { useEffect, useState } from "react";
import { fetchAgentInsight, fetchAgentReflections } from "@/lib/api/agents";

/**
 * useAgentData(category)
 *
 * Haalt op:
 *  - agent insights (samenvatting)
 *  - agent reflections (subfactoren)
 *
 * category kan zijn: "macro", "market", "technical", "setup"
 */
export function useAgentData(category) {
  const [insight, setInsight] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    async function load() {
      setLoading(true);

      console.log(`🧠 [useAgentData] Ophalen AI-data voor categorie: ${category}`);

      try {
        const [ins, refl] = await Promise.all([
          fetchAgentInsight(category),
          fetchAgentReflections(category),
        ]);

        setInsight(ins || null);
        setReflections(refl || []);
      } catch (err) {
        console.error("❌ [useAgentData] Fout bij ophalen agent-data:", err);
        setInsight(null);
        setReflections([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [category]);

  return {
    insight,      // hoofd AI-samenvatting
    reflections,  // subfactoren
    loading
  };
}
