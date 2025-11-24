"use client";

import { useRef, useEffect } from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

export default function GaugeChart({ value = 0, label = "Score" }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const percentage = Math.max(0, Math.min(100, value));

  /* 🎨 PREMIUM FINTECH COLORS */
  const scoreColor =
    percentage >= 70
      ? "#22C55E" // green-500
      : percentage >= 40
      ? "#F59E0B" // amber-500
      : "#EF4444"; // red-500

  const labelColor =
    percentage >= 70
      ? "text-green-600 dark:text-green-300"
      : percentage >= 40
      ? "text-amber-500 dark:text-amber-300"
      : "text-red-500 dark:text-red-300";

  /* 🎨 Background neutral (light gray, no black!) */
  const backgroundArc = "#E5E7EB"; // gray-200

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [percentage, 100 - percentage],
            backgroundColor: [scoreColor, backgroundArc],
            borderWidth: 0,
            cutout: "82%",              // Premium thin ring
            circumference: 180,
            rotation: 270,
            hoverOffset: 0,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 800,
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

      {/* CENTER LABEL */}
      <div className="absolute top-[52%] translate-y-[-50%] flex flex-col items-center">
        <span className={`text-xs font-medium tracking-wide ${labelColor}`}>
          {label}
        </span>

        <span className="text-4xl font-bold text-[var(--text-dark)] dark:text-white leading-tight">
          {value}
        </span>
      </div>
    </div>
  );
}
