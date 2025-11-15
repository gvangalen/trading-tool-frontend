'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ===============================
// 🔹 Dagelijkse scores ophalen
// ===============================
export async function getDailyScores() {
  try {
    return await fetchWithRetry(`${API_BASE_URL}/api/scores/daily`, 'GET');
  } catch (err) {
    console.error('❌ API error getDailyScores:', err);
    return null;
  }
}

// ===============================
// 🔹 AI Master Score ophalen
// ===============================
export async function getAiMasterScore() {
  try {
    return await fetchWithRetry(`${API_BASE_URL}/api/scores/master`, 'GET');
  } catch (err) {
    console.error('❌ API error getAiMasterScore:', err);
    return null;
  }
}

// ===============================
// 🔹 Macro summary ophalen
// ===============================
export async function getMacroSummary() {
  try {
    return await fetchWithRetry(`${API_BASE_URL}/api/macro/summary`, 'GET');
  } catch (err) {
    console.error('❌ API error getMacroSummary:', err);
    return null;
  }
}
