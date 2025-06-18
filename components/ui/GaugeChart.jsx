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
  autoColor = true,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const displayValue =
    typeof value === 'number' && !isNaN(value)
      ? Math.max(0, Math.min(10, value))
      : 0;

  const scoreColor = autoColor
    ? displayValue >= 7
      ? '#22c55e' // groen
      : displayValue >= 4
      ? '#eab308' // geel
      : '#ef4444' // rood
    : color || '#22c55e';

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

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
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [displayValue, scoreColor]);

  return (
    <div className="relative w-36 h-20">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-sm font-semibold"
          style={{ color: scoreColor }}
        >
          {label}
        </span>
        <span
          className="text-xl font-bold"
          style={{ color: scoreColor }}
        >
          {typeof value === 'number' && !isNaN(value)
            ? value.toFixed(1)
            : '-'}{' '}
          / 10
        </span>
      </div>
    </div>
  );
}
