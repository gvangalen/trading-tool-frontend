'use client';

import { useEffect, useState } from 'react';
import { getDailyScores } from '@/lib/api/scores';

// ✅ Adviesfunctie per score
const getAdvies = (score) =>
  score >= 75 ? '📈 Bullish' : score <= 25 ? '📉 Bearish' : '⚖️ Neutraal';

export function useScoresData() {
  const [scores, setScores] = useState({
    macro: {
      score: 0,
      trend: '',
      interpretation: '',
      action: '',
      uitleg: '',
      advies: '⚖️ Neutraal',
    },
    technical: {
      score: 0,
      trend: '',
      interpretation: '',
      action: '',
      uitleg: '',
      advies: '⚖️ Neutraal',
    },
    setup: {
      score: 0,
      trend: '',
      interpretation: '',
      action: '',
      uitleg: '',
      advies: '⚖️ Neutraal',
    },
    market: {
      score: 0,
      uitleg: '',
      advies: '⚖️ Neutraal',
    },
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
        const marketScore = res?.market_score || 0;

        setScores({
          macro: {
            score: macroScore,
            trend: res?.macro_trend || '',
            interpretation: res?.macro_interpretation || '',
            action: res?.macro_action || '',
            uitleg:
              res?.macro_interpretation ||
              res?.macro_action ||
              'Geen uitleg beschikbaar',
            advies: getAdvies(macroScore),
          },
          technical: {
            score: techScore,
            trend: res?.technical_trend || '',
            interpretation: res?.technical_interpretation || '',
            action: res?.technical_action || '',
            uitleg:
              res?.technical_interpretation ||
              res?.technical_action ||
              'Geen uitleg beschikbaar',
            advies: getAdvies(techScore),
          },
          setup: {
            score: setupScore,
            trend: res?.setup_trend || '',
            interpretation: res?.setup_interpretation || '',
            action: res?.setup_action || '',
            uitleg:
              res?.setup_interpretation ||
              res?.setup_action ||
              'Geen uitleg beschikbaar',
            advies: getAdvies(setupScore),
          },
          market: {
            score: marketScore,
            uitleg: 'Marktsituatie op basis van prijs en volume',
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
    ...scores, // macro, technical, setup, market
    loading,
    error,
  };
}
