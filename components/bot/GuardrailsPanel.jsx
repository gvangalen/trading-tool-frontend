"use client";

import { Shield, AlertTriangle } from "lucide-react";

export default function GuardrailsPanel({
  decision = {},
  bot = {},
}) {

  console.log("🧠 GuardrailsPanel decision RAW:", decision);

  /* =====================================================
     SCORES RESOLVE
  ===================================================== */

  let scores =
    decision?.scores ??
    decision?.scores_json ??
    {};

  if (typeof scores === "string") {
    try {
      scores = JSON.parse(scores);
    } catch {
      scores = {};
    }
  }

  /* =====================================================
     GUARDRAILS RESULT (BELANGRIJK)
  ===================================================== */

  const result =
    decision?.guardrails_result ??
    decision?.execution?.guardrails ??
    {};

  const allowed = result?.allowed ?? true;

  const adjusted =
    result?.adjusted_amount_eur ??
    0;

  const original =
    result?.original_amount_eur ??
    adjusted;

  const blockedBy =
    result?.blocked_by ??
    null;

  const warnings =
    result?.warnings ??
    [];

  /* =====================================================
     GUARDRAILS SETTINGS (voor exposure)
  ===================================================== */

  const guardrails =
    result?.guardrails ??
    scores?.guardrails ??
    decision?.guardrails ??
    {};

  const currentExposure =
    guardrails?.current_asset_exposure_pct ?? null;

  const maxExposure =
    guardrails?.max_asset_exposure_pct ?? null;

  console.log("🧠 guardrails_result:", result);

  /* =====================================================
     FORMATTERS
  ===================================================== */

  const formatEUR = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "€0";

    return num.toLocaleString("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });
  };

  /* =====================================================
     REASON TEXT
  ===================================================== */

  const reason =
    blockedBy ??
    warnings?.[0] ??
    null;

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

      {/* Trade status */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Trade status</span>
        <span
          className={`font-medium ${
            allowed
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {allowed ? "Trade allowed" : "Trade blocked"}
        </span>
      </div>

      {/* Adjusted trade */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Adjusted trade</span>
        <span className="font-medium">
          {formatEUR(adjusted)} (requested {formatEUR(original)})
        </span>
      </div>

      {/* Reason */}
      {reason && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Reason</span>
          <span className="font-medium text-orange-600">
            {reason}
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
            {Number(currentExposure).toFixed(0)}% / {Number(maxExposure).toFixed(0)}%
          </span>
        </div>
      )}

      {/* Warnings */}
      {warnings?.length > 0 && (
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
