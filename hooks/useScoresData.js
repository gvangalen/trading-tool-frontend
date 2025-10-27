'use client';

import { useEffect, useState } from 'react';
import { getDailyScores } from '@/lib/api/scores';

// ✅ Adviesfunctie per score
const getAdvies = (score) =>
  score >= 75 ? '📈 Bullish' : score <= 25 ? '📉 Bearish' : '⚖️ Neutraal';

export function useScoresData() {
  const [scores, setScores] = useState({
    macro: { score: 0, trend: '', interpretation: '', action: '', advies: '⚖️ Neutraal' },
    technical: { score: 0, trend: '', interpretation: '', action: '', advies: '⚖️ Neutraal' },
    setup: { score: 0, trend: '', interpretation: '', action: '', advies: '⚖️ Neutraal' },
    sentiment: { score: 0, trend: '', interpretation: '', action: '', advies: '⚖️ Neutraal' },
    market: { score: 0, advies: '⚖️ Neutraal' },
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

        const macroScore = res?.macro_score || 0;
        const techScore = res?.technical_score || 0;
        const setupScore = res?.setup_score || 0;
        const sentimentScore = res?.sentiment_score || 0;
        const marketScore = res?.market_score || 0;

        setScores({
          macro: {
            score: macroScore,
            trend: res?.macro_trend || '',
            interpretation: res?.macro_interpretation || '',
            action: res?.macro_action || '',
            advies: getAdvies(macroScore),
          },
          technical: {
            score: techScore,
            trend: res?.technical_trend || '',
            interpretation: res?.technical_interpretation || '',
            action: res?.technical_action || '',
            advies: getAdvies(techScore),
          },
          setup: {
            score: setupScore,
            trend: res?.setup_trend || '',
            interpretation: res?.setup_interpretation || '',
            action: res?.setup_action || '',
            advies: getAdvies(setupScore),
          },
          sentiment: {
            score: sentimentScore,
            trend: res?.sentiment_trend || '',
            interpretation: res?.sentiment_interpretation || '',
            action: res?.sentiment_action || '',
            advies: getAdvies(sentimentScore),
          },
          market: {
            score: marketScore,
            advies: getAdvies(marketScore),
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
    ...scores, // macro, technical, setup, sentiment, market
    loading,
    error,
  };
}
