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

export default function GaugeChart({
  value = 0,
  label = "Score",
  showNeedle = true,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const s = Math.max(0, Math.min(100, value));

  /* ============================================
     TRADINGVIEW COLORS
  ============================================ */
  const colors = {
    red: "#EF4444",
    orange: "#F59E0B",
    green: "#10B981",
    neutral: "#D1D5DB", // gray-300, lichter dan #E5
  };

  const getColor = () => {
    if (s < 33) return colors.red;       // Strong Sell → Sell
    if (s < 66) return colors.orange;    // Neutral → Buy
    return colors.green;                 // Strong Buy
  };

  const color = getColor();

  /* ============================================
     NEEDLE — same math as TradingView
  ============================================ */
  const angle = (s / 100) * 180 - 90;

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [s, 100 - s],
            borderWidth: 0,
            circumference: 180,
            rotation: 180,
            cutout: "65%",  // dikkere boog
            backgroundColor: [
              color,
              colors.neutral,
            ],
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
  }, [s]);

  return (
    <div className="w-full flex flex-col items-center relative">

      {/* Label */}
      <div className="text-xs font-medium text-[var(--text-light)] mb-1">
        {label}
      </div>

      {/* Gauge */}
      <div className="relative w-full flex justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-[170px] sm:max-w-[200px]"
        />

        {/* Needle */}
        {showNeedle && (
          <div
            className="absolute bottom-[32%] w-0 h-0"
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="
                h-12 w-[2px] 
                bg-[var(--text-dark)]
                dark:bg-white
                rounded-full
              "
            />
          </div>
        )}
      </div>

      {/* SCORE */}
      <div className="mt-2 text-3xl font-bold text-[var(--text-dark)] leading-none">
        {value}
      </div>
    </div>
  );
}
