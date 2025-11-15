'use client';

import { useEffect, useState } from 'react';
import { getDailyScores, getAiMasterScore } from '@/lib/api/scores';

// Score → Advies
const getAdvies = (score) =>
  score >= 75 ? '📈 Bullish' :
  score <= 25 ? '📉 Bearish' :
  '⚖️ Neutraal';

// Zorg dat altijd een array terugkomt
const normalizeArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return []; }
};

export function useScoresData() {
  const [scores, setScores] = useState({
    macro: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    technical: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    market: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    setup: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    master: { score: 0, trend: '–', bias: '–', risk: '–', outlook: '–' },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      const [dailyRes, masterRes] = await Promise.allSettled([
        getDailyScores(),
        getAiMasterScore(),
      ]);

      const daily = dailyRes.status === 'fulfilled' ? dailyRes.value : null;
      const master = masterRes.status === 'fulfilled' ? masterRes.value : null;

      if (!daily) return;

      // BACKEND STRUCTUUR:
      // daily.macro.score
      // daily.macro.interpretation
      // daily.macro.top_contributors

      setScores({
        macro: {
          score: daily.macro?.score ?? 0,
          uitleg: daily.macro?.interpretation ?? 'Geen uitleg beschikbaar',
          advies: getAdvies(daily.macro?.score ?? 0),
          top_contributors: normalizeArray(daily.macro?.top_contributors),
        },
        technical: {
          score: daily.technical?.score ?? 0,
          uitleg: daily.technical?.interpretation ?? 'Geen uitleg beschikbaar',
          advies: getAdvies(daily.technical?.score ?? 0),
          top_contributors: normalizeArray(daily.technical?.top_contributors),
        },
        market: {
          score: daily.market?.score ?? 0,
          uitleg: daily.market?.interpretation ?? 'Geen uitleg beschikbaar',
          advies: getAdvies(daily.market?.score ?? 0),
          top_contributors: normalizeArray(daily.market?.top_contributors),
        },
        setup: {
          score: daily.setup?.score ?? 0,
          uitleg: daily.setup?.interpretation ?? 'Geen uitleg beschikbaar',
          advies: getAdvies(daily.setup?.score ?? 0),
          top_contributors: normalizeArray(daily.setup?.top_contributors),
        },
        master: {
          score: master?.master_score ?? 0,
          trend: master?.master_trend ?? '–',
          bias: master?.master_bias ?? '–',
          risk: master?.master_risk ?? '–',
          outlook: master?.outlook ?? 'Geen outlook',
        },
      });

      setLoading(false);
    }

    fetchScores();
  }, []);

  return { ...scores, loading };
}
