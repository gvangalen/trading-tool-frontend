"use client";

import { Shield, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function GuardrailsPanel({
  decision = {},
  bot = {},
  onRefresh,
}) {

  const result = decision?.guardrails_result || {};
  const guardrails = result?.guardrails || {};

  /* ============================
     LISTEN FOR BUDGET CHANGES
  ============================ */

  useEffect(() => {

    const handleBudgetUpdate = () => {
      onRefresh?.();
    };

    window.addEventListener(
      "bot:budget-updated",
      handleBudgetUpdate
    );

    return () => {
      window.removeEventListener(
        "bot:budget-updated",
        handleBudgetUpdate
      );
    };

  }, [onRefresh]);

  /* ============================
     CORE VALUES
  ============================ */

  const allowed = result?.allowed === true;

  const adjustedAmount =
    Number(result?.adjusted_amount_eur ?? 0);

  const originalAmount =
    Number(result?.original_amount_eur ?? adjustedAmount);

  const warnings =
    result?.warnings ?? [];

  const blockedBy =
    result?.blocked_by ?? null;

  const reason =
    result?.reason ||
    decision?.guardrail_reason ||
    warnings?.[0] ||
    blockedBy ||
    "No guardrail triggered";

  /* ============================
     GUARDRAIL SETTINGS
  ============================ */

  const maxRisk =
    guardrails?.max_trade_risk_eur ??
    bot?.max_risk_per_trade ??
    0;

  const currentExposure =
    guardrails?.current_asset_exposure_pct ?? 0;

  const maxExposure =
    guardrails?.max_asset_exposure_pct ?? 0;

  /* ============================
     FORMAT
  ============================ */

  const eur = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return "€0";

    return n.toLocaleString("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });
  };

  const pct = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return "0%";
    return `${n.toFixed(0)}%`;
  };

  const tradeAdjusted =
    originalAmount !== adjustedAmount;

  /* ============================
     UI
  ============================ */

  return (
    <div className="h-full flex flex-col space-y-4">

      <div className="flex items-center gap-2 font-semibold">
        <Shield size={16} />
        Guardrails
      </div>

      {/* Trade status */}

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          Trade status
        </span>

        <span
          className={`font-medium ${
            allowed
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {allowed ? "Allowed" : "Blocked"}
        </span>
      </div>

      {/* Trade size */}

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          Trade size
        </span>

        <span className="font-medium">
          {tradeAdjusted
            ? `${eur(adjustedAmount)} (requested ${eur(originalAmount)})`
            : eur(adjustedAmount)}
        </span>
      </div>

      {/* Reason */}

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          Reason
        </span>

        <span className="font-medium text-orange-600">
          {reason}
        </span>
      </div>

      {/* Max risk */}

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          Max risk / trade
        </span>

        <span className="font-medium">
          {eur(maxRisk)}
        </span>
      </div>

      {/* BTC exposure */}

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          BTC exposure
        </span>

        <span className="font-medium">
          {pct(currentExposure)} / {pct(maxExposure)}
        </span>
      </div>

      {/* warnings */}

      {warnings.length > 1 && (
        <div className="pt-2 space-y-1">

          <div className="text-xs text-gray-500 uppercase">
            Warnings
          </div>

          {warnings.slice(1).map((w, i) => (
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
