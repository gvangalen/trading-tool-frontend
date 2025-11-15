'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// ===============================
// 🔹 Dagelijkse scores ophalen
// ===============================
export async function getDailyScores() {
  try {
    const res = await fetch(`${API_BASE}/api/scores/daily`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('❌ Fout bij ophalen daily scores:', res.status);
      return null;
    }

    const data = await res.json();
    return data || null;
  } catch (err) {
    console.error('❌ API error getDailyScores:', err);
    return null;
  }
}

// ===============================
// 🔹 Master score ophalen
// ===============================
export async function getAiMasterScore() {
  try {
    const res = await fetch(`${API_BASE}/api/scores/master`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('❌ Fout bij ophalen master score:', res.status);
      return null;
    }

    const data = await res.json();
    return data || null;
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
    const res = await fetch(`${API_BASE}/api/macro/summary`, {
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
