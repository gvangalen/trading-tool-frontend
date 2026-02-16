"use client";

import {
  Shield,
  AlertTriangle,
  ToggleRight,
  ToggleLeft,
  Gauge,
} from "lucide-react";

export default function GuardrailsPanel({
  decision = {},
  bot = {},
}) {
  const killSwitch = bot?.kill_switch ?? true;
  const maxRisk = decision?.max_risk_per_trade ?? bot?.max_risk_per_trade;
  const maxDaily = decision?.max_daily_allocation ?? bot?.max_daily_allocation;
  const warnings = decision?.warnings ?? [];

  const transitionRisk = decision?.transition_risk ?? 0;

  const riskLabel =
    transitionRisk > 70
      ? "High"
      : transitionRisk > 40
      ? "Moderate"
      : "Low";

  return (
    <div className="rounded-xl border bg-white p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2 font-semibold">
        <Shield size={16} />
        Guardrails
      </div>

      {/* LIVE STATUS */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Protection status</span>
        <span className="text-green-600 font-semibold">LIVE</span>
      </div>

      {/* Max risk */}
      {maxRisk && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Max risk / trade</span>
          <span className="font-medium">€{maxRisk}</span>
        </div>
      )}

      {/* Max daily */}
      {maxDaily && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Max per day</span>
          <span className="font-medium">€{maxDaily}</span>
        </div>
      )}

      {/* Kill switch */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Kill switch</span>
        <div className="flex items-center gap-2">
          {killSwitch ? (
            <>
              <ToggleRight className="text-green-500" size={20} />
              <span className="text-green-600 font-medium">Active</span>
            </>
          ) : (
            <>
              <ToggleLeft className="text-gray-400" size={20} />
              <span className="text-gray-400">Off</span>
            </>
          )}
        </div>
      </div>

      {/* Transition risk */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 flex items-center gap-1">
          <Gauge size={14} />
          Transition risk
        </span>
        <span className="font-medium">{riskLabel}</span>
      </div>

      {/* WARNINGS */}
      {warnings.length > 0 && (
        <div className="pt-2 space-y-1">
          <div className="text-xs text-gray-500 uppercase">
            Warnings
          </div>

          {warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-orange-600"
            >
              <AlertTriangle size={14} />
              {w}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
