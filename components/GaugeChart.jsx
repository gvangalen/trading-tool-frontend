// ✅ components/GaugeChart.jsx
'use client';

import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip } from 'chart.js';

Chart.register(ArcElement, Tooltip);

export default function GaugeChart({ label, score }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    const color = score >= 2 ? '#22c55e' : score <= -2 ? '#ef4444' : '#facc15'; // groen / rood / geel

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [Math.min(Math.abs(score) * 10, 100), 100 - Math.min(Math.abs(score) * 10, 100)],
          backgroundColor: [color, '#e5e7eb'],
          borderWidth: 0,
          cutout: '70%',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { enabled: false },
        },
      }
    });

    return () => chart.destroy();
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={120} height={120}></canvas>
      <div className="mt-2 text-sm font-semibold">{label}</div>
    </div>
  );
}
