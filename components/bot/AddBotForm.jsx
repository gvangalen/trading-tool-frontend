"use client";

import { useEffect, useState } from "react";

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

export default function AddBotForm({
  initialForm,
  onChange,
  strategies = [],
}) {
  const isEdit = Boolean(initialForm?.id);

  const [local, setLocal] = useState({
    name: "",
    strategy_id: null,
    mode: "manual",
    risk_profile: "balanced",
  });

  /* =====================================================
     🔁 SYNC BIJ EDIT / INIT
  ===================================================== */
  useEffect(() => {
    if (!initialForm) return;

    setLocal({
      name: initialForm.name ?? "",
      strategy_id:
        typeof initialForm.strategy_id === "number"
          ? initialForm.strategy_id
          : initialForm.strategy?.id ?? null,
      mode: initialForm.mode ?? "manual",
      risk_profile: initialForm.risk_profile ?? "balanced",
    });
  }, [initialForm]);

  /* =====================================================
     📤 PUSH NAAR PARENT (alleen geldig)
  ===================================================== */
  useEffect(() => {
    if (!local.name?.trim()) return;
    if (!local.strategy_id) return;

    onChange?.(local);
  }, [local, onChange]);

  /* =====================================================
     🧠 AFGELEIDE DATA
  ===================================================== */
  const selectedStrategy =
    strategies.find((s) => s.id === local.strategy_id) ??
    initialForm?.strategy ??
    null;

  const selectedRisk =
    RISK_PROFILES.find((r) => r.value === local.risk_profile) ??
    RISK_PROFILES[1];

  /* =====================================================
     🧠 RENDER
  ===================================================== */
  return (
    <div className="space-y-6">
      {/* ================= NAAM ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Bot naam
        </label>
        <input
          className="input w-full"
          placeholder="DCA BTC Bot"
          value={local.name}
          onChange={(e) =>
            setLocal((s) => ({ ...s, name: e.target.value }))
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
              ? `${selectedStrategy.name} · ${String(
                  selectedStrategy.type
                ).toUpperCase()} · ${selectedStrategy.symbol} · ${
                  selectedStrategy.timeframe
                }`
              : "—"}
          </div>
        ) : (
          <select
            className="input w-full"
            value={local.strategy_id ?? ""}
            onChange={(e) =>
              setLocal((s) => ({
                ...s,
                strategy_id: e.target.value
                  ? Number(e.target.value)
                  : null,
              }))
            }
          >
            <option value="">
              — Selecteer een strategie —
            </option>
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {String(s.type).toUpperCase()} ·{" "}
                {s.symbol} · {s.timeframe}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ================= STRATEGY PREVIEW ================= */}
      {selectedStrategy && (
        <div className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm space-y-1">
          <div>
            <b>Type:</b>{" "}
            {String(selectedStrategy.type).toUpperCase()}
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
          value={local.mode}
          onChange={(e) =>
            setLocal((s) => ({
              ...s,
              mode: e.target.value,
            }))
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
          value={local.risk_profile}
          onChange={(e) =>
            setLocal((s) => ({
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
