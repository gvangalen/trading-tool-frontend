"use client";

import { useEffect, useState } from "react";

/**
 * AddBotForm (NEW MODEL)
 * --------------------------------------------------
 * Bot = uitvoerder
 * Strategy = intelligentie
 *
 * Velden:
 * - name
 * - strategy_id (NUMBER, verplicht)
 * - mode
 *
 * Props:
 * - initialForm (bij edit)
 * - onChange(form)
 * - strategies [{ id, name, type, symbol, timeframe }]
 */
export default function AddBotForm({
  initialForm,
  onChange,
  strategies = [],
}) {
  const [local, setLocal] = useState({
    name: "",
    strategy_id: null, // ⬅️ ALTIJD number | null
    mode: "manual",
  });

  /* =====================================================
     🔁 SYNC BIJ EDIT
  ===================================================== */
  useEffect(() => {
    if (initialForm) {
      setLocal({
        name: initialForm.name ?? "",
        strategy_id:
          typeof initialForm.strategy_id === "number"
            ? initialForm.strategy_id
            : initialForm.strategy?.id ?? null,
        mode: initialForm.mode ?? "manual",
      });
    }
  }, [initialForm]);

  /* =====================================================
     📤 PUSH NAAR PARENT
     (alleen als form valide is)
  ===================================================== */
  useEffect(() => {
    if (!local.name) return;
    if (!local.strategy_id) return;

    onChange?.(local);
  }, [local, onChange]);

  /* =====================================================
     🧠 AFGELEIDE DATA
  ===================================================== */
  const selectedStrategy =
    strategies.find((s) => s.id === local.strategy_id) ?? null;

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
      </div>

      {/* ================= STRATEGY PREVIEW ================= */}
      {selectedStrategy && (
        <div className="rounded-lg border p-3 bg-[var(--card-muted)] text-sm space-y-1">
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
            <div className="text-muted">
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
    </div>
  );
}
