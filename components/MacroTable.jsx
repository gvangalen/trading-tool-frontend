'use client';
import { useEffect, useState } from 'react';

const API_URL = '/api/dashboard_data';

export default function MacroTable() {
  const [macroData, setMacroData] = useState([]);
  const [avgScore, setAvgScore] = useState('N/A');
  const [advies, setAdvies] = useState('⚖️ Neutraal');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function safeFetch(url) {
    let retries = 3;
    while (retries > 0) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Fout bij ophalen van ${url}`);
        const data = await res.json();
        if (!data || !data.macro_data) throw new Error("Lege response");
        return data.macro_data;
      } catch (err) {
        console.error("❌ safeFetch:", err);
        retries--;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    return [];
  }

  async function loadData() {
    const data = await safeFetch(API_URL);
    setMacroData(data);
    updateScore(data);
    markStepDone(3);
  }

  function calculateMacroScore(name, value) {
    if (name === "fear_greed_index")
      return value > 75 ? 2 : value > 55 ? 1 : value < 30 ? -2 : value < 45 ? -1 : 0;
    if (name === "btc_dominance")
      return value > 55 ? 2 : value > 50 ? 1 : value < 45 ? -2 : value < 48 ? -1 : 0;
    if (name === "dxy")
      return value < 100 ? 2 : value < 103 ? 1 : value > 107 ? -2 : value > 104 ? -1 : 0;
    return 0;
  }

  function getExplanation(name) {
    const uitleg = {
      fear_greed_index: "Lage waarde = angst, hoge waarde = hebzucht.",
      btc_dominance: "Hoge dominantie = minder altcoin-risico.",
      dxy: "Lage DXY = gunstig voor crypto."
    };
    return uitleg[name] || "Geen uitleg beschikbaar";
  }

  function updateScore(data) {
    let total = 0, count = 0;
    data.forEach(ind => {
      const s = calculateMacroScore(ind.name, parseFloat(ind.value));
      if (!isNaN(s)) {
        total += s;
        count++;
      }
    });
    const avg = count ? (total / count).toFixed(1) : 'N/A';
    setAvgScore(avg);
    setAdvies(avg >= 1.5 ? '🟢 Bullish' : avg <= -1.5 ? '🔴 Bearish' : '⚖️ Neutraal');
  }

  function handleEdit(name, current) {
    const nieuw = prompt(`Wijzig waarde voor ${name}:`, current);
    if (nieuw && !isNaN(parseFloat(nieuw))) {
      const updated = macroData.map(ind =>
        ind.name === name ? { ...ind, value: parseFloat(nieuw) } : ind
      );
      setMacroData(updated);
      updateScore(updated);
    }
  }

  function handleRemove(name) {
    const updated = macroData.filter(ind => ind.name !== name);
    setMacroData(updated);
    updateScore(updated);
  }

  function markStepDone(step) {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;
    fetch(`/api/onboarding_progress/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step })
    });
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-700">
        Gemiddelde score: <strong>{avgScore}</strong> | Advies: <strong>{advies}</strong>
      </div>
      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>Indicator</th>
            <th>Waarde</th>
            <th>Trend</th>
            <th>Interpretatie</th>
            <th>Actie</th>
            <th>Score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {macroData.map(ind => {
            const score = calculateMacroScore(ind.name, parseFloat(ind.value));
            const kleur = score >= 2 ? 'text-green-600' : score <= -2 ? 'text-red-600' : 'text-gray-600';
            return (
              <tr key={ind.name} className="border-t">
                <td className="p-2" title={getExplanation(ind.name)}>{ind.name}</td>
                <td>{ind.value}</td>
                <td>{ind.trend || '–'}</td>
                <td>{ind.interpretation || '–'}</td>
                <td>{ind.action || '–'}</td>
                <td className={`${kleur} font-semibold`}>{score}</td>
                <td>
                  <button onClick={() => handleEdit(ind.name, ind.value)} className="mr-2">✏️</button>
                  <button onClick={() => handleRemove(ind.name)}>❌</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
