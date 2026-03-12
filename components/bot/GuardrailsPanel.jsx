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
     DEBUG LOGGING
  ===================================================== */

  console.log("🧠 GuardrailsPanel decision RAW:", decision);

  let scores = decision?.scores_json;

  // parse string JSON indien nodig
  if (typeof scores === "string") {
    try {
      scores = JSON.parse(scores);
      console.log("🧠 scores_json parsed:", scores);
    } catch (err) {
      console.error("❌ scores_json parse error:", err);
      scores = {};
    }
  }

  console.log("🧠 scores_json object:", scores);

  /* =====================================================
     🔐 GUARDRAILS STATE
  ===================================================== */

  const guardrails =
    scores?.guardrails ??
    decision?.guardrails ??
    {};

  console.log("🧠 guardrails resolved:", guardrails);

  const killSwitch =
    guardrails?.kill_switch ??
    bot?.kill_switch ??
    true;

  const maxRisk =
    guardrails?.max_trade_risk_eur ??
    decision?.max_risk_per_trade ??
    0;

  const maxDaily =
    guardrails?.daily_allocation_eur ??
    decision?.max_daily_allocation ??
    0;

  console.log("🧠 maxRisk:", maxRisk);
  console.log("🧠 maxDaily:", maxDaily);

  const currentExposure =
    guardrails?.current_asset_exposure_pct ?? null;

  const maxExposure =
    guardrails?.max_asset_exposure_pct ?? null;

  const warnings = Array.isArray(scores?.warnings)
    ? scores.warnings
    : Array.isArray(decision?.warnings)
    ? decision.warnings
    : [];

  const transitionRisk =
    Number(scores?.transition_risk) ||
    Number(decision?.transition_risk) ||
    0;

  console.log("🧠 transitionRisk:", transitionRisk);

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

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2 font-semibold">
        <Shield size={16} />
        Guardrails
      </div>

      {/* Protection status */}
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
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Max risk / trade</span>
        <span className="font-medium">
          {formatEUR(maxRisk)}
        </span>
      </div>

      {/* Max daily allocation */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Max per day</span>
        <span className="font-medium">
          {formatEUR(maxDaily)}
        </span>
      </div>

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
