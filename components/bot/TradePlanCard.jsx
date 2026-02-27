"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Target,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

const num = (v, d = null) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const fmtEur = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return `€${Math.round(n).toLocaleString("nl-NL")}`;
};

const fmtPrice = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("nl-NL");
};

const clampArr = (arr) => (Array.isArray(arr) ? arr : []);

function Badge({ ok, labelOk, labelFail }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold",
        ok
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200",
      ].join(" ")}
    >
      {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {ok ? labelOk : labelFail}
    </span>
  );
}

function SectionTitle({ icon, title, right }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        {icon}
        <span>{title}</span>
      </div>
      {right}
    </div>
  );
}

/**
 * TradePlanCard — WATCH MODE UPDATE (UI ONLY)
 *
 * - Watch mode volgt nu decision.monitoring / decision.alerts_active
 * - Watch levels uit decision.watch_levels
 * - Geen edit UI (bewust), alleen tonen
 */
export default function TradePlanCard({
  tradePlan = null,
  decision = null,
  loading = false,
  isGenerating = false,
  onGenerate,
  onSave, // blijft in props voor later, maar niet gebruikt in UI
  allowManual = true, // idem
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => tradePlan || null);

  useEffect(() => {
    if (!editing) setDraft(tradePlan || null);
  }, [tradePlan, editing]);

  const plan = draft;

  const derived = useMemo(() => {
    const fallbackPlan = plan || decision?.trade_plan || null;

    if (!fallbackPlan) {
      return {
        symbol: decision?.symbol || "BTC",
        side: decision?.action || "buy",
        entry_plan: [],
        stop_loss: null,
        targets: [],
        risk: null,
        constraints: {
          within_budget: false,
          within_risk: false,
          warnings: [],
        },
        _ready: false,
      };
    }

    const entry = clampArr(fallbackPlan.entry_plan);
    const targets = clampArr(fallbackPlan.targets);

    const constraints = {
      within_budget: fallbackPlan.constraints?.within_budget ?? false,
      within_risk: fallbackPlan.constraints?.within_risk ?? false,
      max_risk_per_trade:
        fallbackPlan.constraints?.max_risk_per_trade ??
        decision?.max_risk_per_trade,
      max_daily_allocation:
        fallbackPlan.constraints?.max_daily_allocation ??
        decision?.max_daily_allocation,
      warnings: fallbackPlan.constraints?.warnings ?? decision?.warnings ?? [],
    };

    const ready =
      entry.length > 0 &&
      !!fallbackPlan.stop_loss?.price &&
      targets.length > 0 &&
      constraints.within_budget &&
      constraints.within_risk;

    return {
      ...fallbackPlan,
      entry_plan: entry,
      targets,
      constraints,
      _ready: ready,
    };
  }, [plan, decision]);

  // ✅ WATCH MODE — CORRECT (source of truth = decision)
  const showWatchMode = decision?.monitoring === true;

  const watchLevels = decision?.watch_levels || {};

  const pullback =
    watchLevels.pullback_zone ?? watchLevels.pullback ?? null;

  const breakout =
    watchLevels.breakout_trigger ?? watchLevels.breakout ?? null;

  const monitoringActive = decision?.monitoring === true;
  const alertsActive = decision?.alerts_active === true;

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <div className="text-sm text-gray-500">Trade plan laden…</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-5">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Bot size={18} />
            Trade Plan
          </div>
          <div className="text-sm text-gray-500">
            {derived.symbol} · {(derived.side || "buy").toUpperCase()}
          </div>
        </div>

        <div className="flex gap-2">
          {onGenerate && (
            <button onClick={onGenerate} className="btn-outline flex gap-2">
              <RotateCcw size={16} />
              {isGenerating ? "Genereren…" : "Genereer"}
            </button>
          )}
        </div>
      </div>

      {/* WATCH MODE */}
      {showWatchMode && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 space-y-2">
          <div className="font-semibold text-indigo-900">
            Bot wacht op entry
          </div>

          <div className="text-sm text-indigo-800 space-y-1">
            {pullback && <div>📉 Pullback zone: €{fmtPrice(pullback)}</div>}
            {breakout && <div>📈 Breakout trigger: €{fmtPrice(breakout)}</div>}

            {!pullback && !breakout && (
              <div>Bot monitort de markt voor een entry trigger.</div>
            )}
          </div>

          <div className="text-xs text-indigo-700 flex gap-2">
            <span>⚡ Monitoring {monitoringActive ? "actief" : "uit"}</span>
            <span>•</span>
            <span>⚡ Alerts {alertsActive ? "actief" : "uit"}</span>
          </div>
        </div>
      )}

      {/* BADGES */}
      <div className="flex flex-wrap gap-2">
        <Badge
          ok={derived._ready}
          labelOk="klaar om te plaatsen"
          labelFail="niet klaar"
        />
        <Badge
          ok={derived.constraints.within_budget}
          labelOk="binnen budget"
          labelFail="budget limiet"
        />
        <Badge
          ok={derived.constraints.within_risk}
          labelOk="binnen risk limits"
          labelFail="risk limiet"
        />
      </div>

      {/* ENTRY */}
      <div className="rounded-xl border p-4 space-y-3">
        <SectionTitle icon={<TrendingUp size={16} />} title="Entry Plan" />
        {derived.entry_plan.length === 0 ? (
          <div className="text-sm text-gray-500">—</div>
        ) : (
          derived.entry_plan.map((e, i) => (
            <div
              key={i}
              className="flex justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div>{(e.type || "buy").toUpperCase()}</div>
              <div className="font-semibold">{fmtPrice(e.price)}</div>
            </div>
          ))
        )}
      </div>

      {/* STOP */}
      <div className="rounded-xl border p-4">
        <SectionTitle icon={<Shield size={16} />} title="Stop Loss" />
        <div className="font-semibold">{fmtPrice(derived.stop_loss?.price)}</div>
      </div>

      {/* TARGETS */}
      <div className="rounded-xl border p-4">
        <SectionTitle icon={<Target size={16} />} title="Targets" />
        {derived.targets.length === 0 ? (
          <div className="text-sm text-gray-500">—</div>
        ) : (
          derived.targets.map((t, i) => (
            <div key={i} className="flex justify-between">
              <span>{t.label}</span>
              <span className="font-semibold">{fmtPrice(t.price)}</span>
            </div>
          ))
        )}
      </div>

      {/* RISK */}
      <div className="rounded-xl border p-4 space-y-1">
        <SectionTitle icon={<AlertTriangle size={16} />} title="Risk" />
        <div className="text-sm text-gray-600">
          Risk: {fmtEur(derived.risk?.risk_eur)}
        </div>
        <div className="text-sm text-gray-600">
          R:R: {derived.risk?.rr ?? "—"}
        </div>
      </div>
    </div>
  );
}
