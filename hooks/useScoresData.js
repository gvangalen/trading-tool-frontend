'use client';

import { useEffect, useState } from 'react';
import { getDailyScores } from '@/lib/api/scores';

export function useScoreMeters() {
  const [scores, setScores] = useState({
    macro: null,
    technical: null,
    setup: null,
    sentiment: null,
  });
  const [advies, setAdvies] = useState('Neutral');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      const res = await getDailyScores();

      if (res) {
        setScores({
          macro: res?.macro_score ?? null,
          technical: res?.technical_score ?? null,
          setup: res?.setup_score ?? null,
          sentiment: res?.sentiment_score ?? null,
        });

        const tech = res?.technical_score ?? 0;
        setAdvies(
          tech >= 50 ? '📈 Bullish' :
          tech <= 25 ? '📉 Bearish' :
          '⚖️ Neutraal'
        );
      }

      setLoading(false);
    }

    fetchScores();
  }, []);

  return { ...scores, advies, loading };
}
