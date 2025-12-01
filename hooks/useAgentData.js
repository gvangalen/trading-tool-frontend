"use client";

import { useEffect, useState } from "react";
import {
  fetchAgentInsight,
  fetchAgentReflections,
} from "@/lib/api/agents";

export function useAgentData(category) {
  const [insight, setInsight] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    async function load() {
      setLoading(true);
      console.log(`🧠 [useAgentData] Load AI-data for: ${category}`);

      try {
        // 👉 deze helpers praten al met API_BASE_URL en
        // geven direct het binnenste object terug
        const insightData = await fetchAgentInsight(category);      // object of null
        const reflectionsData = await fetchAgentReflections(category); // array

        setInsight(insightData || null);
        setReflections(Array.isArray(reflectionsData) ? reflectionsData : []);
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
