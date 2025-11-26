'use client';

import { useRef, useEffect } from 'react';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from 'chart.js';

// Vereiste registratie
Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

export default function GaugeChart({ value = 0 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // Clamp value between 0–100
  const percentage = Math.max(0, Math.min(100, value));

  // Kleur op basis van score
  const scoreColor =
    percentage >= 70
      ? '#22c55e'
      : percentage >= 40
      ? '#facc15'
      : '#ef4444';

  useEffect(() => {
    if (!canvasRef.current) return;

    // Vernietig oude chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Nieuwe chart
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
          duration: 700,
          easing: 'easeOutCubic',
        },
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [percentage, scoreColor]);

  return (
    <div className="relative w-full h-36 flex items-center justify-center">

      {/* Chart Canvas */}
      <canvas ref={canvasRef} className="max-w-[180px]" />

      {/* Score onder meter */}
      <div
        className="
          absolute
          bottom-4
          text-[28px]
          font-semibold
          text-[var(--text-dark)]
          pointer-events-none
        "
        style={{ marginBottom: '-6px' }} // trekt score dichter tegen de meter
      >
        {percentage}
      </div>

    </div>
  );
}
