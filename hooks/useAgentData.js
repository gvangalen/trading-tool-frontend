import { useEffect, useState } from "react";

export function useAgentInsight(category) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    async function fetchInsight() {
      try {
        const res = await fetch(`/api/agents/insights?category=${category}`);
        const json = await res.json();
        setData(json.insight || null);
      } catch (e) {
        console.error("Insight error:", e);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchInsight();
  }, [category]);

  return { data, loading };
}
