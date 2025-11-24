'use client';

import { useRef, useEffect } from 'react';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from 'chart.js';

// ✅ Vereiste registratie
Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

export default function GaugeChart({ value = 0, label = 'Score' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // Clamp value between 0–100
  const percentage = Math.max(0, Math.min(100, value));

  // ✅ Automatische kleur op basis van waarde
  const scoreColor =
    percentage >= 70
      ? '#22c55e' // groen
      : percentage >= 40
      ? '#facc15' // geel
      : '#ef4444'; // rood

  const colorClass =
    percentage >= 70
      ? 'text-green-600'
      : percentage >= 40
      ? 'text-yellow-500'
      : 'text-red-500';

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [percentage, 100 - percentage],
            backgroundColor: [scoreColor, '#e5e7eb'],
            borderWidth: 0,
            cutout: '80%',
            circumference: 180,
            rotation: 270,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 800,
          easing: 'easeOutCubic',
        },
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [percentage, scoreColor]);

  return (
    <div className="relative w-full h-32 flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="max-w-[180px]" />
      <div className="absolute top-[42%] flex flex-col items-center">
        <span className={`text-sm font-medium ${colorClass}`}>{label}</span>
        <span className="text-3xl font-bold text-black dark:text-white">
          {value}
        </span>
      </div>
    </div>
  );
}
