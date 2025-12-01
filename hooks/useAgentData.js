"use client";

import { useEffect, useState } from "react";
import { fetchAgentInsight, fetchAgentReflections } from "@/lib/api/agents";

export function useAgentData(category) {
  const [insight, setInsight] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    async function load() {
      setLoading(true);

      try {
        const insightData = await fetchAgentInsight(category);
        const reflectionData = await fetchAgentReflections(category);

        setInsight(insightData?.insight || null);
        setReflections(reflectionData?.reflections || []);
      } catch (err) {
        console.error("❌ useAgentData fout:", err);
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
