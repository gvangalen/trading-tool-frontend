'use client';

import { useEffect, useState } from 'react';
import { getDailyScores } from '@/lib/api/scores';

export function useScoresData() {
  const [scores, setScores] = useState({
    macro: { score: 0, trend: '', interpretation: '', action: '' },
    technical: { score: 0, trend: '', interpretation: '', action: '' },
    setup: { score: 0, trend: '', interpretation: '', action: '' },
    sentiment: { score: 0, trend: '', interpretation: '', action: '' },
    market: { score: 0 }, // ✅ nieuw toegevoegd
  });

  const [advies, setAdvies] = useState('⚖️ Neutraal');
  const [loading, setLoading] = useState(true);

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
            score: res?.macro_score || 0,
            trend: res?.macro_trend || '',
            interpretation: res?.macro_interpretation || '',
            action: res?.macro_action || '',
          },
          technical: {
            score: res?.technical_score || 0,
            trend: res?.technical_trend || '',
            interpretation: res?.technical_interpretation || '',
            action: res?.technical_action || '',
          },
          setup: {
            score: res?.setup_score || 0,
            trend: res?.setup_trend || '',
            interpretation: res?.setup_interpretation || '',
            action: res?.setup_action || '',
          },
          sentiment: {
            score: res?.sentiment_score || 0,
            trend: res?.sentiment_trend || '',
            interpretation: res?.sentiment_interpretation || '',
            action: res?.sentiment_action || '',
          },
          market: {
            score: res?.market_score || 0, // ✅ opgehaald uit API
          },
        });

        const techScore = res?.technical_score || 0;
        setAdvies(
          techScore >= 75
            ? '📈 Bullish'
            : techScore <= 25
            ? '📉 Bearish'
            : '⚖️ Neutraal'
        );
      } catch (err) {
        console.error('❌ Fout bij ophalen daily scores:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  return {
    ...scores, // macro, technical, setup, sentiment, market
    advies,
    loading,
  };
}
