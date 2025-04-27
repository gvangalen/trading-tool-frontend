'use client';

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function GaugeChart({ value = 0, label = 'Score', color = '#4ade80' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [value, 10 - value],
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
  }, [value, color]);

  return (
    <div className="relative w-32 h-16">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
        <span className="font-semibold">{label}</span>
        <span className="text-lg font-bold">{value ?? '-'} / 10</span>
      </div>
    </div>
  );
}
