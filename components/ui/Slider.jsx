"use client";

import { useState, useEffect } from "react";

/* =====================================================
   BASIC SLIDER (voor settings)
===================================================== */

export function BasicSlider({
  label,
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  suffix = "%",
  onChange,
}) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="block text-sm font-medium">
          {label}
        </label>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-full cursor-pointer"
      />

      <div className="flex justify-between text-xs text-[var(--text-muted)]">

        <span>{min}{suffix}</span>

        <span className="font-medium text-[var(--text-primary)]">
          {value}{suffix}
        </span>

        <span>{max}{suffix}</span>

      </div>

    </div>
  );
}

/* =====================================================
   TRADING SLIDER (Bybit style)
===================================================== */

export function TradingSlider({
  value = 0,
  steps = [0, 25, 50, 75, 100],
  suffix = "%",
  onChange,
}) {

  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (v) => {
    setInternalValue(v);
    onChange?.(v);
  };

  const percent = internalValue;

  return (
    <div className="space-y-3">

      {/* Slider track */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">

        {/* Progress */}
        <div
          className="absolute h-full bg-green-500 transition-all duration-200"
          style={{ width: `${percent}%` }}
        />

        {/* Input */}
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={percent}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />

      </div>

      {/* Step points */}
      <div className="relative flex justify-between items-center">

        {steps.map((s) => {

          const active = percent >= s;

          return (
            <button
              key={s}
              type="button"
              onClick={() => handleChange(s)}
              className={`w-4 h-4 rounded-full border transition
                ${active
                  ? "bg-green-500 border-green-500"
                  : "bg-gray-200 border-gray-300"
                }`}
            />
          );
        })}

      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-[var(--text-muted)]">
        {steps.map((s) => (
          <span key={s}>
            {s}{suffix}
          </span>
        ))}
      </div>

    </div>
  );
}
