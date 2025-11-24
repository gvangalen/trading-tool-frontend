"use client";

import { useRef, useEffect } from 'react';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController
} from 'chart.js';

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

export default function GaugeChart({ value = 0, label = "Score" }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const percentage = Math.max(0, Math.min(100, value));

  // Fintech colors
  const scoreColor =
    percentage >= 70
      ? "#10B981" // green-500
      : percentage >= 40
      ? "#FACC15" // yellow-400
      : "#EF4444"; // red-500

  const labelColor =
    percentage >= 70
      ? "text-green-600 dark:text-green-300"
      : percentage >= 40
      ? "text-yellow-500 dark:text-yellow-300"
      : "text-red-500 dark:text-red-300";

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [percentage, 100 - percentage],
            backgroundColor: [
              scoreColor,
              "#1F2937" // gray-800 (fintech dark neutral)
            ],
            borderWidth: 0,
            cutout: "78%",
            circumference: 180,
            rotation: 270,
            hoverOffset: 0,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 900,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [percentage]);

  return (
    <div className="relative w-full h-36 flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="max-w-[200px]" />

      {/* Center text */}
      <div className="absolute top-[45%] translate-y-[-50%] text-center">
        <span className={`text-xs font-medium ${labelColor}`}>
          {label}
        </span>

        <span className="block text-4xl font-bold text-[var(--text-dark)] dark:text-white leading-tight">
          {value}
        </span>
      </div>
    </div>
  );
}
