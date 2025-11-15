'use client';

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// ===============================
// 🔹 Dagelijkse scores ophalen
// ===============================
export async function getDailyScores() {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/scores/daily`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('❌ Fout bij ophalen daily scores:', res.status);
      return null;
    }

    return await res.json();
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
    const res = await fetchWithRetry(`${API_BASE_URL}/api/scores/master`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('❌ Fout bij ophalen master score:', res.status);
      return null;
    }

    return await res.json();
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
    const res = await fetchWithRetry(`${API_BASE_URL}/api/macro/summary`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('❌ Fout bij ophalen macro summary:', res.status);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('❌ API error getMacroSummary:', err);
    return null;
  }
}
