'use client';

import { useRef, useEffect } from 'react';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

export default function GaugeChart({ value = 0, label = 'Score' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // Clamp value between 0 and 100
  const percentage = Math.max(0, Math.min(100, value));

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
            backgroundColor: ['#4ade80', '#e5e7eb'],
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
  }, [percentage]);

  return (
    <div className="relative w-full h-32 flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="max-w-[180px]" />
      <div className="absolute top-[45%] flex flex-col items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</span>
        <span className="text-3xl font-bold text-black dark:text-white">
          {value}
        </span>
      </div>
    </div>
  );
}
