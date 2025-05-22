'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto.cjs';
import { API_BASE_URL } from '@/config';

const SCORE_LABELS = ["Strong Sell", "Sell", "Neutral", "Buy", "Strong Buy"];
const EXPLANATION_MAP = {
  "-2": "📉 Negatief signaal op meerdere indicatoren.",
  "-1": "⚠️ Licht bearish sentiment.",
  "0": "😐 Neutraal: markt is in balans.",
  "1": "📈 Voorzichtig positief momentum.",
  "2": "🚀 Sterk positief signaal!"
};

export default function ScoreGauge({ id, label }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: SCORE_LABELS,
        datasets: [{
          data: [20, 20, 20, 20, 20],
          backgroundColor: ["#ff3b30", "#ff9500", "#f0ad4e", "#4cd964", "#34c759"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 180,
        cutout: "80%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/score/${id}`);
      const data = await res.json();
      const score = data.total_score ?? 0;

      const labelIndex = Math.max(0, Math.min(4, Math.round((score + 2) / 4 * 4)));
      const labelText = SCORE_LABELS[labelIndex];
      const explanation = EXPLANATION_MAP[score.toString()] || "Geen uitleg.";

      // ✅ Chart update
      if (chartRef.current) {
        chartRef.current.data.datasets[0].data = SCORE_LABELS.map((_, i) => i === labelIndex ? 100 : 20);
        chartRef.current.update();
      }

      // ✅ Score en uitleg
      document.getElementById(`${id}Score`).textContent = `Score: ${score}`;
      document.getElementById(`${id}Explanation`).innerHTML = `
        <div style="text-align:center; margin-top: 8px;">
          <strong style="font-size: 1.1rem;">${labelText}</strong><br />
          <span style="font-size: 0.9rem; color: #666;">${explanation}</span>
        </div>
      `;

      // ✅ Log per indicator
      const logDiv = document.getElementById(`${id}Log`);
      if (logDiv) {
        logDiv.innerHTML = `<ul>`;
        for (const [key, val] of Object.entries(data.scores || {})) {
          const value = val?.value ?? "-";
          const s = val?.score ?? "-";
          logDiv.innerHTML += `<li><strong>${key}</strong>: ${value} → <code>score ${s}</code></li>`;
        }
        logDiv.innerHTML += `</ul>`;
      }

      // ✅ Setup-specific: Top 3 & beste uitleg
      if (id === 'setup' && data.setups) {
        const best = [...data.setups].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];
        const mini = document.getElementById("topSetupsMini");

        if (best && mini) {
          const top = data.setups
            .filter(s => typeof s.score === 'number')
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(s => `⭐️ <strong>${s.name}</strong> → <code>${s.score}</code>`);

          mini.innerHTML = `<strong>Top 3 setups</strong><ul><li>${top.join('</li><li>')}</li></ul>`;
        }
      }

    } catch (err) {
      console.error(`❌ Fout bij ophalen ${id} score:`, err);
    }
  }

  return (
    <div className="gauge-wrapper space-y-2">
      <canvas ref={canvasRef} id={`${id}Gauge`} className="w-full h-40" />
      <div className="text-center font-semibold">{label}</div>
      <div className="score-label text-sm text-center" id={`${id}Score`}>Score: ⏳</div>
      <div className="explanation text-center text-gray-600 text-sm" id={`${id}Explanation`}>Uitleg wordt geladen...</div>
      <div className="log-block text-xs px-2" id={`${id}Log`}></div>
      {id === 'setup' && <div id="topSetupsMini" className="log-block mt-2 text-xs px-2"></div>}
    </div>
  );
}
