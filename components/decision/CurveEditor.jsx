"use client";

import React, { useEffect, useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

/**
 * CurveEditor — v2.0
 *
 * Editor voor investerings- of score-curves
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
 * - xLabel?: string   (default: "Score (0–100)")
 * - yLabel?: string   (default: "× Basisbedrag")
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
  xLabel = "Marktscore (0–100)",
  yLabel = "× Basisbedrag",
  disabled = false,
}) {
  // --------------------------------------------------
  // Normalize curve
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const updatePoint = (index, patch) => {
    const next = points.map((p, i) =>
      i === index ? { ...p, ...patch } : p
    );
    onChange({ ...curve, points: next });
  };

  const addPoint = () => {
    const lastX = points[points.length - 1]?.x ?? 60;
    const nextX = Math.min(lastX + 10, 100);

    onChange({
      ...curve,
      points: [...points, { x: nextX, y: 1.0 }],
    });
  };

  const removePoint = (index) => {
    if (points.length <= 2) return;
    onChange({
      ...curve,
      points: points.filter((_, i) => i !== index),
    });
  };

  // --------------------------------------------------
  // Auto-sort on X (score)
  // --------------------------------------------------
  useEffect(() => {
    const sorted = [...points].sort((a, b) => a.x - b.x);
    if (JSON.stringify(sorted) !== JSON.stringify(points)) {
      onChange({ ...curve, points: sorted });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-sm">
            Investeringsverdeling op basis van score
          </h4>
          <p className="text-xs opacity-70">
            Bij deze score investeren we meer of minder dan het basisbedrag
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

      {/* Axis labels */}
      <div className="grid grid-cols-[80px_1fr_90px_40px] text-xs opacity-70 px-1">
        <div>{xLabel}</div>
        <div className="text-center">Investeringsgewicht</div>
        <div className="text-right">{yLabel}</div>
        <div />
      </div>

      {/* Points */}
      <div className="space-y-3">
        {points.map((p, i) => (
          <div
            key={i}
            className={`grid grid-cols-[80px_1fr_90px_40px] gap-3 items-center ${
              disabled ? "opacity-60" : ""
            }`}
          >
            {/* Score */}
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
              className="p-1 rounded border text-sm text-center"
            />

            {/* Multiplier slider */}
            <Slider
              min={0}
              max={3}
              step={0.05}
              disabled={disabled}
              value={p.y}
              onChange={(v) => updatePoint(i, { y: v })}
            />

            {/* Multiplier input */}
            <input
              type="number"
              min={0}
              step={0.05}
              disabled={disabled}
              value={p.y}
              onChange={(e) =>
                updatePoint(i, { y: Number(e.target.value) })
              }
              className="p-1 rounded border text-sm text-right"
            />

            {/* Remove */}
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
      <div className="text-xs pt-2 opacity-70">
        <strong>Voorbeeld:</strong>
        <div className="mt-1 space-y-1">
          {points.map((p, i) => (
            <div key={i}>
              Score {p.x} → {p.y}× basisbedrag
            </div>
          ))}
        </div>
      </div>

      {disabled && (
        <div className="text-xs italic opacity-60 pt-2">
          Vast bedrag gebruikt deze curve niet
        </div>
      )}
    </div>
  );
}
