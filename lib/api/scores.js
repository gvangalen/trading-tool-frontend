'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ===============================
// 🔹 Dagelijkse scores ophalen
// ===============================
export async function getDailyScores() {
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/api/scores/daily`, 'GET');
    return data;
  } catch (err) {
    console.error('❌ Fout bij getDailyScores:', err);
    return null;
  }
}

// ===============================
// 🔹 AI Master Score ophalen (CORRECTE BACKEND ROUTE!)
// ===============================
export async function getAiMasterScore() {
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/api/ai/master_score`, 'GET');
    return data;
  } catch (err) {
    console.error('❌ Fout bij getAiMasterScore:', err);
    return null;
  }
}

// ===============================
// 🔹 Macro summary ophalen
// ===============================
export async function getMacroSummary() {
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/api/macro/summary`, 'GET');
    return data;
  } catch (err) {
    console.error('❌ Fout bij getMacroSummary:', err);
    return null;
  }
}
