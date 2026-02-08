"use client";

import React, { useEffect, useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

/**
 * CurveEditor
 *
 * Headless editor voor decision / scoring curves
 *
 * JSON shape:
 * {
 *   input: "market_score",
 *   points: [
 *     { x: 20, y: 1.5 },
 *     { x: 40, y: 1.2 },
 *     { x: 60, y: 1.0 },
 *     { x: 80, y: 0.5 }
 *   ]
 * }
 *
 * Props:
 * - value: curve object
 * - onChange: (curve) => void
 * - xLabel?: string
 * - yLabel?: string
 * - disabled?: boolean
 */

const DEFAULT_POINTS = [
  { x: 20, y: 1.5 },
  { x: 40, y: 1.2 },
  { x: 60, y: 1.0 },
  { x: 80, y: 0.5 },
];

export default function CurveEditor({
  value,
  onChange,
  xLabel = "Score (0–100)",
  yLabel = "Multiplier",
  disabled = false,
}) {
  // ---------------------------------------------
  // Init / normalize
  // ---------------------------------------------
  const curve = useMemo(() => {
    if (!value || !Array.isArray(value.points)) {
      return {
        input: "market_score",
        points: DEFAULT_POINTS,
      };
    }
    return value;
  }, [value]);

  const points = curve.points;

  // ---------------------------------------------
  // Helpers
  // ---------------------------------------------
  const updatePoint = (index, newPoint) => {
    const next = points.map((p, i) =>
      i === index ? { ...p, ...newPoint } : p
    );

    onChange({
      ...curve,
      points: next,
    });
  };

  const addPoint = () => {
    const lastX = points[points.length - 1]?.x ?? 80;
    const nextX = Math.min(lastX + 10, 100);

    onChange({
      ...curve,
      points: [...points, { x: nextX, y: 1.0 }],
    });
  };

  const removePoint = (index) => {
    if (points.length <= 2) return; // minimaal 2 punten
    onChange({
      ...curve,
      points: points.filter((_, i) => i !== index),
    });
  };

  // ---------------------------------------------
  // Sort on x (veiligheid)
  // ---------------------------------------------
  useEffect(() => {
    const sorted = [...points].sort((a, b) => a.x - b.x);
    if (JSON.stringify(sorted) !== JSON.stringify(points)) {
      onChange({ ...curve, points: sorted });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  // ---------------------------------------------
  // Render
  // ---------------------------------------------
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm">Decision Curve</h4>
          <p className="text-xs text-muted-foreground">
            {xLabel} → {yLabel}
          </p>
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={addPoint}
            className="text-xs px-2 py-1 rounded-md border hover:bg-gray-100"
          >
            + Punt
          </button>
        )}
      </div>

      {/* Points editor */}
      <div className="space-y-3">
        {points.map((p, i) => (
          <div
            key={i}
            className="grid grid-cols-[80px_1fr_80px_40px] gap-3 items-center"
          >
            {/* X value */}
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              disabled={disabled}
              value={p.x}
              onChange={(e) =>
                updatePoint(i, { x: Number(e.target.value) })
              }
              className="p-1 rounded border text-sm"
            />

            {/* Slider */}
            <Slider
              min={0}
              max={3}
              step={0.05}
              disabled={disabled}
              value={p.y}
              onChange={(v) => updatePoint(i, { y: v })}
            />

            {/* Y value */}
            <input
              type="number"
              min={0}
              step={0.05}
              disabled={disabled}
              value={p.y}
              onChange={(e) =>
                updatePoint(i, { y: Number(e.target.value) })
              }
              className="p-1 rounded border text-sm"
            />

            {/* Delete */}
            {!disabled && (
              <button
                type="button"
                onClick={() => removePoint(i)}
                className="text-xs text-red-500 hover:underline"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="text-xs text-muted-foreground pt-2">
        <strong>Preview:</strong>{" "}
        {points.map((p) => `${p.x}→${p.y}`).join(" | ")}
      </div>
    </div>
  );
}
