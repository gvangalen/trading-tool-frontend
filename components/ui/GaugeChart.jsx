'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

export default function GaugeChart({
  value = 0,
  label = 'Score',
  color,
  autoColor = true, // ✅ toggle voor automatische kleuren
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // ✅ Score tussen 0 en 10
  const displayValue =
    typeof value === 'number' && !isNaN(value)
      ? Math.max(0, Math.min(10, value))
      : 0;

  // ✅ Automatische kleur op basis van waarde
  const scoreColor = autoColor
    ? displayValue >= 7
      ? '#4ade80' // groen
      : displayValue >= 4
      ? '#facc15' // geel
      : '#f87171' // rood
    : color || '#4ade80';

  useEffect(() => {
    if (!canvasRef.current) return;

    // ✅ Verwijder oude chart bij update
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [displayValue, 10 - displayValue],
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
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [displayValue, scoreColor]);

  return (
    <div className="relative w-28 h-14 sm:w-32 sm:h-16">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
        <span className="font-semibold">{label}</span>
        <span className="text-lg font-bold">
          {typeof value === 'number' && !isNaN(value) ? value.toFixed(1) : '-'} / 10
        </span>
      </div>
    </div>
  );
}
