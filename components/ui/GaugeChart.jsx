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

export default function GaugeChart({ value = 0, label = "" }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const score = Math.max(0, Math.min(100, value));

  const COLORS = {
    red: "#EF4444",
    orange: "#F59E0B",
    green: "#10B981",
    gray: "#E5E7EB",
  };

  const getColor = () => {
    if (score < 30) return COLORS.red;
    if (score < 70) return COLORS.orange;
    return COLORS.green;
  };

  // Correct needle angle (TradingView)
  const angle = (score / 100) * 180 + 90;

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [score, 100 - score],
            backgroundColor: [getColor(), COLORS.gray],
            borderWidth: 0,

            // CORRECT TRADINGVIEW ROTATION
            rotation: 270,       // start at top
            circumference: 180,  // top half only

            cutout: "72%",
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
  }, [score]);

  return (
    <div className="relative flex flex-col items-center pt-2">
      {/* GAUGE */}
      <div className="relative flex justify-center w-full">
        <canvas ref={canvasRef} className="max-w-[180px]" />

        {/* NEEDLE */}
        <div
          className="absolute top-[42%] h-16 w-0"
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <div className="w-[2px] h-full bg-black dark:bg-white rounded-full" />
        </div>
      </div>

      {/* SCORE BELOW */}
      <div className="mt-3 text-3xl font-extrabold text-[var(--text-dark)]">
        {score}
      </div>

      <div className="text-sm font-medium text-[var(--text-light)] mt-1 tracking-tight">
        {label}
      </div>
    </div>
  );
}
