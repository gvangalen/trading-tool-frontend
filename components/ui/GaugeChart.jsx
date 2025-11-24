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

  // Clamp 0–100
  const s = Math.max(0, Math.min(100, value));

  // TradingView gradient colors
  const red = "#EF4444";
  const yellow = "#F59E0B";
  const green = "#10B981";
  const gray = "#E5E7EB";

  const getColor = () => {
    if (s <= 33) return red;
    if (s <= 66) return yellow;
    return green;
  };

  // Needle angle
  const angle = (s / 100) * 180 - 90;

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: "Gauge",
            data: [s, 100 - s],
            borderWidth: 0,
            circumference: 180,
            rotation: 180,
            cutout: "70%",
            backgroundColor: [
              getColor(),
              gray,
            ],
            borderCapStyle: "round",
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
  }, [s]);

  return (
    <div className="w-full flex flex-col items-center relative py-2">
      
      {/* Label ABOVE gauge */}
      <div className="text-sm font-medium text-[var(--text-light)] mb-1">
        {label}
      </div>

      {/* Gauge */}
      <div className="relative w-full flex justify-center">
        <canvas ref={canvasRef} className="max-w-[200px]" />

        {/* Needle */}
        {showNeedle && (
          <div
            className="absolute bottom-[28%] w-0 h-0"
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="h-12 w-[2px] bg-black dark:bg-white rounded-full"
              style={{ marginLeft: "-1px" }}
            />
          </div>
        )}
      </div>

      {/* Score BELOW gauge */}
      <div className="mt-2 text-3xl font-bold text-[var(--text-dark)]">
        {value}
      </div>
    </div>
  );
}
