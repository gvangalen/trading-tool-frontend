'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GaugeChart({ value = 0, label = 'Score', color = '#4ade80' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const displayValue =
    typeof value === 'number' && !isNaN(value)
      ? Math.max(0, Math.min(10, value))
      : 0;

  useEffect(() => {
    if (canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new ChartJS(canvasRef.current, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [displayValue, 10 - displayValue],
              backgroundColor: [color, '#e5e7eb'],
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
    }
  }, [displayValue, color]);

  return (
    <div className="relative w-32 h-16">
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
