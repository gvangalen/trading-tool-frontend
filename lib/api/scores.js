'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';


// =====================================================
// 🔹 1. Dagelijkse scores ophalen (met stabiele fallback)
// =====================================================
export async function getDailyScores() {
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/api/scores/daily`, 'GET');

    // ⛑️ Fallback → voorkomt 0-scores en lege meters op dashboard
    if (!data || typeof data !== 'object') {
      console.warn("⚠️ getDailyScores(): backend gaf leeg resultaat terug → fallback gebruikt");
      return {
        macro_score: 50,
        technical_score: 50,
        market_score: 50,
        setup_score: 50,

        macro_interpretation: "Licht neutraal",
        technical_interpretation: "Licht neutraal",
        market_interpretation: "Licht neutraal",
        setup_interpretation: "Licht neutraal",

        macro_top_contributors: [],
        technical_top_contributors: [],
        market_top_contributors: [],
        setup_top_contributors: []
      };
    }

    return data;

  } catch (err) {
    console.error('❌ Fout bij getDailyScores:', err);

    // ⛑️ Fallback ook bij HTTP-errors
    return {
      macro_score: 50,
      technical_score: 50,
      market_score: 50,
      setup_score: 50,

      macro_interpretation: "Licht neutraal",
      technical_interpretation: "Licht neutraal",
      market_interpretation: "Licht neutraal",
      setup_interpretation: "Licht neutraal",

      macro_top_contributors: [],
      technical_top_contributors: [],
      market_top_contributors: [],
      setup_top_contributors: []
    };
  }
}


// =====================================================
// 🔹 2. AI Master Score ophalen
// =====================================================
export async function getAiMasterScore() {
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/api/ai/master_score`, 'GET');
    return data || { master_score: 50 };
  } catch (err) {
    console.error('❌ Fout bij getAiMasterScore:', err);
    return { master_score: 50 };
  }
}


// =====================================================
// 🔹 3. Macro summary ophalen
// =====================================================
export async function getMacroSummary() {
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/api/macro/summary`, 'GET');
    return data || [];
  } catch (err) {
    console.error('❌ Fout bij getMacroSummary:', err);
    return [];
  }
}
