'use client';

import { useEffect, useState } from 'react';
import { getDailyScores, getAiMasterScore } from '@/lib/api/scores';

// ✅ Adviesfunctie per score
const getAdvies = (score) =>
  score >= 75 ? '📈 Bullish' : score <= 25 ? '📉 Bearish' : '⚖️ Neutraal';

export function useScoresData() {
  const [scores, setScores] = useState({
    macro: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    technical: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    setup: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    market: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    master: { score: 0, trend: '–', bias: '–', risk: '–', outlook: '–' },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchScores() {
      try {
        // 🔹 Haal beide endpoints parallel op
        const [daily, master] = await Promise.all([
          getDailyScores(),
          getAiMasterScore(),
        ]);

        if (!daily && !master) {
          console.warn('⚠️ Geen scores ontvangen van API');
          setLoading(false);
          return;
        }

        console.log('📊 Ontvangen daily scores:', daily);
        console.log('🧠 Ontvangen AI master score:', master);

        setScores({
          macro: {
            score: daily?.macro?.score ?? 0,
            uitleg: daily?.macro?.interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(daily?.macro?.score ?? 0),
            top_contributors: daily?.macro?.top_contributors ?? [],
          },
          technical: {
            score: daily?.technical?.score ?? 0,
            uitleg: daily?.technical?.interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(daily?.technical?.score ?? 0),
            top_contributors: daily?.technical?.top_contributors ?? [],
          },
          setup: {
            score: daily?.setup?.score ?? 0,
            uitleg: daily?.setup?.interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(daily?.setup?.score ?? 0),
            top_contributors: daily?.setup?.top_contributors ?? [],
          },
          market: {
            score: daily?.market?.score ?? 0,
            uitleg: daily?.market?.interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(daily?.market?.score ?? 0),
            top_contributors: daily?.market?.top_contributors ?? [],
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
        console.error('❌ Fout bij ophalen scores:', err);
        setError('Kon scores niet laden.');
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  return {
    ...scores, // macro, technical, setup, market, master
    loading,
    error,
  };
}
