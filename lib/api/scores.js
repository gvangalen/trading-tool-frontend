// ✅ lib/api/scores.js

export async function getDailyScores() {
  try {
    const res = await fetch('/api/scores/daily');
    if (!res.ok) throw new Error('Fout bij ophalen daily scores');
    return await res.json();
  } catch (err) {
    console.error('❌ Fout in getDailyScores:', err);
    return null;
  }
}
