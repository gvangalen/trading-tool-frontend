'use client';

import { useEffect, useState } from 'react';
import { getDailyScores } from '@/lib/api/scores';

// ✅ Adviesfunctie per score
const getAdvies = (score) =>
  score >= 75 ? '📈 Bullish' : score <= 25 ? '📉 Bearish' : '⚖️ Neutraal';

export function useScoresData() {
  const [scores, setScores] = useState({
    macro: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    technical: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    setup: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
    market: { score: 0, uitleg: '', advies: '⚖️ Neutraal', top_contributors: [] },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await getDailyScores();
        if (!res) {
          console.warn('⚠️ Geen scores ontvangen van API');
          setLoading(false);
          return;
        }

        console.log('📊 Ontvangen daily scores:', res);

        setScores({
          macro: {
            score: res?.macro?.score ?? 0,
            uitleg: res?.macro?.interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(res?.macro?.score ?? 0),
            top_contributors: res?.macro?.top_contributors ?? [],
          },
          technical: {
            score: res?.technical?.score ?? 0,
            uitleg: res?.technical?.interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(res?.technical?.score ?? 0),
            top_contributors: res?.technical?.top_contributors ?? [],
          },
          setup: {
            score: res?.setup?.score ?? 0,
            uitleg: res?.setup?.interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(res?.setup?.score ?? 0),
            top_contributors: res?.setup?.top_contributors ?? [],
          },
          market: {
            score: res?.market?.score ?? 0,
            uitleg: res?.market?.interpretation ?? 'Geen uitleg beschikbaar',
            advies: getAdvies(res?.market?.score ?? 0),
            top_contributors: res?.market?.top_contributors ?? [],
          },
        });
      } catch (err) {
        console.error('❌ Fout bij ophalen daily scores:', err);
        setError('Kon scores niet laden.');
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  return {
    ...scores, // macro, technical, setup, market
    loading,
    error,
  };
}
