'use client';

import { useEffect, useState } from 'react';
import { getDailyScores, getAiMasterScore } from '@/lib/api/scores';

// Score → Advies
const getAdvies = (score) =>
  score >= 75 ? '📈 Bullish'
  : score <= 25 ? '📉 Bearish'
  : '⚖️ Neutraal';

// Zorg dat altijd een array terugkomt
const normalizeArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try {
    return JSON.parse(v);
  } catch {
    return [];
  }
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
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchScores() {
      try {
        // Nooit meer crash door master score
        const [dailyRes, masterRes] = await Promise.allSettled([
          getDailyScores(),
          getAiMasterScore(),
        ]);

        const daily =
          dailyRes.status === 'fulfilled' ? dailyRes.value : null;
        const master =
          masterRes.status === 'fulfilled' ? masterRes.value : null;

        if (!daily) {
          console.error("❌ Daily scores ontbreken — dit mag eigenlijk nooit.");
          return;
        }

        setScores({
          macro: {
            score: daily.macro_score ?? 0,
            uitleg: daily.macro_interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(daily.macro_score ?? 0),
            top_contributors: normalizeArray(daily.macro_top_contributors),
          },
          technical: {
            score: daily.technical_score ?? 0,
            uitleg: daily.technical_interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(daily.technical_score ?? 0),
            top_contributors: normalizeArray(daily.technical_top_contributors),
          },
          market: {
            score: daily.market_score ?? 0,
            uitleg: daily.market_interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(daily.market_score ?? 0),
            top_contributors: normalizeArray(daily.market_top_contributors),
          },
          setup: {
            score: daily.setup_score ?? 0,
            uitleg: daily.setup_interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(daily.setup_score ?? 0),
            top_contributors: normalizeArray(daily.setup_top_contributors),
          },
          master: {
            score: master?.master_score ?? 0,
            trend: master?.master_trend ?? '–',
            bias: master?.master_bias ?? '–',
            risk: master?.master_risk ?? '–',
            outlook: master?.outlook ?? 'Geen outlook',
          },
        });

      } catch (err) {
        console.error("❌ Fout bij verwerken scores:", err);
        setError("Kon scores niet laden.");
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  return { ...scores, loading, error };
}
