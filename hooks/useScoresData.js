'use client';

import { useEffect, useState } from 'react';
import { getDailyScores } from '@/lib/api/scores';

export function useScoresData() {
  const [scores, setScores] = useState({
    macro: null,
    technical: null,
    setup: null,
    sentiment: null,
  });
  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      const res = await getDailyScores();

      if (res) {
        setScores({
          macro: {
            score: res?.macro_score ?? null,
            trend: res?.macro_trend ?? null,
            interpretation: res?.macro_interpretation ?? null,
            action: res?.macro_action ?? null,
          },
          technical: {
            score: res?.technical_score ?? null,
            trend: res?.technical_trend ?? null,
            interpretation: res?.technical_interpretation ?? null,
            action: res?.technical_action ?? null,
          },
          setup: {
            score: res?.setup_score ?? null,
            trend: res?.setup_trend ?? null,
            interpretation: res?.setup_interpretation ?? null,
            action: res?.setup_action ?? null,
          },
          sentiment: {
            score: res?.sentiment_score ?? null,
            trend: res?.sentiment_trend ?? null,
            interpretation: res?.sentiment_interpretation ?? null,
            action: res?.sentiment_action ?? null,
          },
        });

        const techScore = res?.technical_score ?? 0;
        setAdvies(
          techScore >= 75 ? '📈 Bullish' :
          techScore <= 25 ? '📉 Bearish' :
          '⚖️ Neutraal'
        );
      }

      setLoading(false);
    }

    fetchScores();
  }, []);

  return {
    ...scores,  // geeft macro, technical, setup, sentiment als objecten
    advies,
    loading,
  };
}
