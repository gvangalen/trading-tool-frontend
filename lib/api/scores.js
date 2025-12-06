'use client';

import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { API_BASE_URL } from '@/lib/config';

//
// =====================================================
// 🔹 1. Dagelijkse scores ophalen (met veilige fallback)
// =====================================================
export async function getDailyScores() {
  try {
    const data = await fetchWithAuth(`/api/scores/daily`, 'GET');

    if (!data || typeof data !== 'object') {
      console.warn("⚠️ getDailyScores(): backend gaf leeg resultaat → fallback");
      return fallbackScores();
    }

    return data;

  } catch (err) {
    console.error('❌ getDailyScores ERROR:', err);
    return fallbackScores();
  }
}

//
// =====================================================
// 🔹 2. AI Master Score ophalen
// =====================================================
export async function getAiMasterScore() {
  try {
    const data = await fetchWithAuth(`/api/ai/master_score`, 'GET');
    return data || { master_score: 50 };
  } catch (err) {
    console.error('❌ getAiMasterScore ERROR:', err);
    return { master_score: 50 };
  }
}

//
// =====================================================
// 🔹 3. Macro summary ophalen
// =====================================================
export async function getMacroSummary() {
  try {
    const data = await fetchWithAuth(`/api/macro/summary`, 'GET');
    return data || [];
  } catch (err) {
    console.error('❌ getMacroSummary ERROR:', err);
    return [];
  }
}

//
// =====================================================
// 🔹 Fallback scores (gebruikt in errors / no data)
// =====================================================
function fallbackScores() {
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
