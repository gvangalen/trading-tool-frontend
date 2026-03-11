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

  /* =====================================================
     🔐 GUARDRAILS STATE (NEW ENGINE STRUCTURE)
  ===================================================== */

  // ⭐ NIEUW: eerst uit scores_json lezen
  const guardrails =
    decision?.scores_json?.guardrails ??
    decision?.guardrails ??
    {};

  const killSwitch =
    guardrails?.kill_switch ??
    bot?.kill_switch ??
    true;

  const maxRisk =
    guardrails?.max_trade_risk_eur ??
    decision?.scores_json?.max_risk_per_trade ??
    decision?.max_risk_per_trade ??
    0;

  const maxDaily =
    guardrails?.daily_allocation_eur ??
    decision?.scores_json?.max_daily_allocation ??
    decision?.max_daily_allocation ??
    0;

  const currentExposure =
    guardrails?.current_asset_exposure_pct ?? null;

  const maxExposure =
    guardrails?.max_asset_exposure_pct ?? null;

  const warnings = Array.isArray(decision?.scores_json?.warnings)
    ? decision.scores_json.warnings
    : Array.isArray(decision?.warnings)
    ? decision.warnings
    : [];

  // ⭐ transition risk ook uit scores_json
  const transitionRisk =
    Number(decision?.scores_json?.transition_risk) ||
    Number(decision?.transition_risk) ||
    0;

  /* =====================================================
     🎯 RISK LABEL + COLOR
  ===================================================== */

  const riskLabel =
    transitionRisk > 70
      ? "High"
      : transitionRisk > 40
      ? "Moderate"
      : "Low";

  const riskColor =
    transitionRisk > 70
      ? "text-red-600"
      : transitionRisk > 40
      ? "text-orange-500"
      : "text-green-600";

  /* =====================================================
     💰 SAFE EUR FORMAT
  ===================================================== */

  const formatEUR = (value) => {
    const num = Number(value);
    if (!num) return "€0";

    return num.toLocaleString("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2 font-semibold">
        <Shield size={16} />
        Guardrails
      </div>

      {/* LIVE STATUS */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Protection status</span>

        <span
          className={`font-semibold ${
            killSwitch
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {killSwitch ? "LIVE" : "DISABLED"}
        </span>
      </div>

      {/* Max risk per trade */}
      {maxRisk !== null && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Max risk / trade</span>
          <span className="font-medium">
            {formatEUR(maxRisk)}
          </span>
        </div>
      )}

      {/* Max daily allocation */}
      {maxDaily !== null && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Max per day</span>
          <span className="font-medium">
            {formatEUR(maxDaily)}
          </span>
        </div>
      )}

      {/* BTC Exposure */}
      {currentExposure !== null && maxExposure !== null && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            BTC exposure
          </span>

          <span className="font-medium">
            {currentExposure.toFixed(0)}% / {maxExposure}%
          </span>
        </div>
      )}

      {/* Kill switch */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Kill switch</span>

        <div className="flex items-center gap-2">
          {killSwitch ? (
            <>
              <ToggleRight className="text-green-500" size={20} />
              <span className="text-green-600 font-medium">
                Active
              </span>
            </>
          ) : (
            <>
              <ToggleLeft className="text-gray-400" size={20} />
              <span className="text-gray-400">
                Off
              </span>
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

        <span className={`font-medium ${riskColor}`}>
          {riskLabel}
        </span>
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
