"use client";

import { useEffect, useState } from "react";

import {
  fetchMacroInsight,
  fetchMarketInsight,
  fetchTechnicalInsight,
  fetchSetupInsight,
  fetchStrategyInsight,
  fetchMacroReflections,
  fetchMarketReflections,
  fetchTechnicalReflections,
  fetchSetupReflections,
  fetchStrategyReflections,
} from "@/lib/api/agents";

import { fetchActiveStrategyToday } from "@/lib/api/strategy";

/* ======================================================
   🧠 INSIGHTS + REFLECTIES (BESTAAND)
   → Wordt gebruikt door AgentInsightPanel
====================================================== */

const insightMap = {
  macro: fetchMacroInsight,
  market: fetchMarketInsight,
  technical: fetchTechnicalInsight,
  setup: fetchSetupInsight,
  strategy: fetchStrategyInsight,
};

const reflectionMap = {
  macro: fetchMacroReflections,
  market: fetchMarketReflections,
  technical: fetchTechnicalReflections,
  setup: fetchSetupReflections,
  strategy: fetchStrategyReflections,
};

export function useAgentData(category) {
  const [insight, setInsight] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const load = async () => {
      setLoading(true);
      console.log(`🧠 [useAgentData] load voor categorie: ${category}`);

      const fetchInsightFn = insightMap[category];
      const fetchReflectionsFn = reflectionMap[category];

      if (!fetchInsightFn || !fetchReflectionsFn) {
        console.error(`❌ Geen fetch functie gevonden voor category=${category}`);
        setInsight(null);
        setReflections([]);
        setLoading(false);
        return;
      }

      try {
        const [insightData, reflectionsData] = await Promise.all([
          fetchInsightFn(),
          fetchReflectionsFn(),
        ]);

        setInsight(insightData || null);
        setReflections(Array.isArray(reflectionsData) ? reflectionsData : []);
      } catch (e) {
        console.error("❌ [useAgentData] Fout:", e);
        setInsight(null);
        setReflections([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category]);

  return {
    insight,
    reflections,
    loading,
  };
}

/* ======================================================
   🎯 ACTIEVE STRATEGIE VANDAAG (NIEUW)
   → Voor de nieuwe Strategy Today Card
====================================================== */

export function useActiveStrategyToday() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchActiveStrategyToday();

        // Geen actieve strategie vandaag = null
        setData(res || null);
      } catch (e) {
        console.error("❌ [useActiveStrategyToday] Fout:", e);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return {
    strategy: data,
    loading,
  };
}
