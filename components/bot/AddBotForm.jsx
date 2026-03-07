"use client";

import { useEffect, useMemo, useState } from "react";

const RISK_PROFILES = [
  {
    value: "conservative",
    label: "🛡️ Conservative",
    description: "Alleen trades bij hoge confidence, lage frequentie",
  },
  {
    value: "balanced",
    label: "⚖️ Balanced",
    description: "Standaard profiel met gebalanceerde trade-frequentie",
  },
  {
    value: "aggressive",
    label: "🚀 Aggressive",
    description: "Sneller trades, hogere exposure en risico",
  },
];

/**
 * AddBotForm — TradeLayer 2.5 (FINAL)
 */
export default function AddBotForm({
  initialData = null,
  strategies = [],
  onChange,
}) {

  const isEdit = Boolean(initialData?.id ?? initialData?.bot_id);

  const [form, setForm] = useState({
    id: undefined,
    bot_id: undefined,
    name: "",
    strategy_id: null,
    mode: "manual",
    risk_profile: "balanced",
  });

  /* =====================================================
     INIT / PREFILL
  ===================================================== */
  useEffect(() => {
    if (!initialData) return;

    setForm({
      id: initialData.id,
      bot_id: initialData.bot_id,
      name: initialData.name ?? "",
      strategy_id:
        typeof initialData.strategy_id === "number"
          ? initialData.strategy_id
          : initialData.strategy?.id ?? null,
      mode: initialData.mode ?? "manual",
      risk_profile: initialData.risk_profile ?? "balanced",
    });
  }, [initialData]);

  /* =====================================================
     LIVE SYNC NAAR PARENT
  ===================================================== */
  useEffect(() => {
    onChange?.(form);
  }, [form, onChange]);

  /* =====================================================
     DERIVED
  ===================================================== */
  const selectedStrategy = useMemo(() => {
    return (
      strategies.find((s) => s.id === form.strategy_id) ??
      initialData?.strategy ??
      null
    );
  }, [strategies, form.strategy_id, initialData]);

  const selectedRisk =
    RISK_PROFILES.find((r) => r.value === form.risk_profile) ??
    RISK_PROFILES[1];

  const getStrategyType = (s) =>
    (s?.strategy_type || s?.type || "manual").toUpperCase();

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="space-y-6">

      {/* ================= BOT NAME ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Bot naam
        </label>

        <input
          className="input w-full"
          placeholder="DCA BTC Bot"
          value={form.name}
          onChange={(e) =>
            setForm((s) => ({ ...s, name: e.target.value }))
          }
        />
      </div>

      {/* ================= STRATEGY ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Strategie
        </label>

        {isEdit ? (

          <div className="input w-full bg-[var(--surface-2)] cursor-not-allowed">
            {selectedStrategy
              ? `${selectedStrategy.name} · ${getStrategyType(
                  selectedStrategy
                )} · ${selectedStrategy.symbol} · ${
                  selectedStrategy.timeframe
                }`
              : "—"}
          </div>

        ) : (

          <select
            className="input w-full"
            value={form.strategy_id ?? ""}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                strategy_id: e.target.value
                  ? Number(e.target.value)
                  : null,
              }))
            }
          >

            <option value="">— Selecteer een strategie —</option>

            {strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.display_name || `${s.name} · ${s.symbol} · ${s.timeframe}`}
              </option>
            ))}

          </select>

        )}
      </div>

      {/* ================= STRATEGY PREVIEW ================= */}
      {selectedStrategy && (
        <div className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm space-y-1">

          <div>
            <b>Type:</b> {getStrategyType(selectedStrategy)}
          </div>

          <div>
            <b>Asset:</b> {selectedStrategy.symbol}
          </div>

          <div>
            <b>Timeframe:</b> {selectedStrategy.timeframe}
          </div>

          {selectedStrategy.description && (
            <div className="text-[var(--text-muted)]">
              {selectedStrategy.description}
            </div>
          )}

        </div>
      )}

      {/* ================= MODE ================= */}
      <div>

        <label className="block text-sm font-medium mb-1">
          Mode
        </label>

        <select
          className="input w-full"
          value={form.mode}
          onChange={(e) =>
            setForm((s) => ({ ...s, mode: e.target.value }))
          }
        >

          <option value="manual">Manual</option>
          <option value="semi">Semi-auto</option>
          <option value="auto">Auto</option>

        </select>

      </div>

      {/* ================= RISK PROFILE ================= */}
      <div>

        <label className="block text-sm font-medium mb-1">
          Risk profile
        </label>

        <select
          className="input w-full"
          value={form.risk_profile}
          onChange={(e) =>
            setForm((s) => ({
              ...s,
              risk_profile: e.target.value,
            }))
          }
        >

          {RISK_PROFILES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}

        </select>

        <div className="mt-1 text-xs text-[var(--text-muted)]">
          {selectedRisk.description}
        </div>

      </div>

    </div>
  );
}
