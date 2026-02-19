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
  Pencil,
  Save,
  RotateCcw,
  Plus,
  Trash2,
} from "lucide-react";

/**
 * TradePlanCard — FINAL
 *
 * ondersteunt:
 * ✅ backend plan
 * ✅ decision fallback
 * ✅ manual overrides
 * ✅ execution readiness
 */

const num = (v, d = null) => {
  const n = Number(v);
  return isFinite(n) ? n : d;
};

const fmtEur = (v) => {
  const n = Number(v);
  if (!isFinite(n)) return "—";
  return `€${Math.round(n).toLocaleString("nl-NL")}`;
};

const fmtPrice = (v) => {
  const n = Number(v);
  if (!isFinite(n)) return "—";
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

export default function TradePlanCard({
  tradePlan = null,
  decision = null,
  loading = false,
  isGenerating = false,
  onGenerate,
  onSave,
  allowManual = true,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => tradePlan || null);

  // sync backend updates
  useEffect(() => {
    if (!editing) setDraft(tradePlan || null);
  }, [tradePlan, editing]);

  const plan = draft;

  const derived = useMemo(() => {
    // ✅ FALLBACK: direct tonen als decision trade plan bevat
    const fallbackPlan =
      plan ||
      decision?.trade_plan ||
      null;

    if (!fallbackPlan) {
      return {
        status: "none",
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
        notes: { summary: "Nog geen trade plan beschikbaar." },
      };
    }

    const entry = clampArr(fallbackPlan.entry_plan);
    const targets = clampArr(fallbackPlan.targets);

    const constraints = {
      within_budget:
        fallbackPlan.constraints?.within_budget ??
        true,
      within_risk:
        fallbackPlan.constraints?.within_risk ??
        true,
      max_risk_per_trade:
        fallbackPlan.constraints?.max_risk_per_trade ??
        decision?.max_risk_per_trade,
      max_daily_allocation:
        fallbackPlan.constraints?.max_daily_allocation ??
        decision?.max_daily_allocation,
      warnings:
        fallbackPlan.constraints?.warnings ??
        decision?.warnings ??
        [],
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

  const canEdit = allowManual && !!onSave;

  const setEntry = (idx, patch) => {
    setDraft((p) => {
      const next = { ...(p || {}) };
      const arr = clampArr(next.entry_plan).slice();
      arr[idx] = { ...(arr[idx] || {}), ...patch };
      next.entry_plan = arr;
      return next;
    });
  };

  const addEntry = () =>
    setDraft((p) => ({
      ...(p || {}),
      entry_plan: [...clampArr(p?.entry_plan), { type: "buy", price: 0 }],
    }));

  const removeEntry = (idx) =>
    setDraft((p) => {
      const arr = clampArr(p?.entry_plan).slice();
      arr.splice(idx, 1);
      return { ...(p || {}), entry_plan: arr };
    });

  const setTarget = (idx, patch) => {
    setDraft((p) => {
      const next = { ...(p || {}) };
      const arr = clampArr(next.targets).slice();
      arr[idx] = { ...(arr[idx] || {}), ...patch };
      next.targets = arr;
      return next;
    });
  };

  const addTarget = () =>
    setDraft((p) => ({
      ...(p || {}),
      targets: [...clampArr(p?.targets), { label: "TP", price: 0 }],
    }));

  const removeTarget = (idx) =>
    setDraft((p) => {
      const arr = clampArr(p?.targets).slice();
      arr.splice(idx, 1);
      return { ...(p || {}), targets: arr };
    });

  const setStop = (price) =>
    setDraft((p) => ({
      ...(p || {}),
      stop_loss: { price: num(price, 0) },
    }));

  const setRiskField = (key, value) =>
    setDraft((p) => ({
      ...(p || {}),
      risk: { ...(p?.risk || {}), [key]: num(value, 0) },
    }));

  const handleSave = async () => {
    if (!onSave) return;
    await onSave(draft);
    setEditing(false);
  };

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

          {canEdit && (
            <button
              onClick={() => setEditing(!editing)}
              className="btn-secondary flex gap-2"
            >
              <Pencil size={16} />
              {editing ? "Stop edit" : "Edit"}
            </button>
          )}

          {canEdit && editing && (
            <button onClick={handleSave} className="btn-primary flex gap-2">
              <Save size={16} />
              Opslaan
            </button>
          )}
        </div>
      </div>

      {/* BADGES */}
      <div className="flex flex-wrap gap-2">
        <Badge ok={derived._ready} labelOk="klaar om te plaatsen" labelFail="niet klaar" />
        <Badge ok={derived.constraints.within_budget} labelOk="binnen budget" labelFail="budget limiet" />
        <Badge ok={derived.constraints.within_risk} labelOk="binnen risk limits" labelFail="risk limiet" />
      </div>

      {/* ENTRY */}
      <div className="rounded-xl border p-4 space-y-3">
        <SectionTitle
          icon={<TrendingUp size={16} />}
          title="Entry Plan"
          right={
            editing && (
              <button onClick={addEntry} className="text-indigo-600 text-xs flex gap-1">
                <Plus size={14}/> entry
              </button>
            )
          }
        />

        {derived.entry_plan.map((e, i) => (
          <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-lg">
            <div>{(e.type || "buy").toUpperCase()}</div>

            {editing ? (
              <input
                type="number"
                value={e.price}
                onChange={(ev) => setEntry(i, { price: ev.target.value })}
                className="border rounded px-2 py-1 w-28 text-right"
              />
            ) : (
              <div className="font-semibold">{fmtPrice(e.price)}</div>
            )}
          </div>
        ))}
      </div>

      {/* STOP + TARGETS */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <SectionTitle icon={<Shield size={16}/>} title="Stop Loss" />
          {editing ? (
            <input
              type="number"
              value={derived.stop_loss?.price || 0}
              onChange={(e)=>setStop(e.target.value)}
              className="border rounded px-2 py-1 w-full text-right"
            />
          ) : (
            <div className="font-semibold">{fmtPrice(derived.stop_loss?.price)}</div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <SectionTitle icon={<Target size={16}/>} title="Targets" />
          {derived.targets.map((t,i)=>(
            <div key={i} className="flex justify-between">
              <span>{t.label}</span>
              <span className="font-semibold">{fmtPrice(t.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RISK */}
      <div className="rounded-xl border p-4 space-y-2">
        <SectionTitle icon={<AlertTriangle size={16}/>} title="Risk" />
        <div>Risk: {fmtEur(derived.risk?.risk_eur)}</div>
        <div>R:R: {derived.risk?.rr ?? "—"}</div>
      </div>

      {/* WARNINGS */}
      {derived.constraints.warnings?.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-sm text-orange-800">
          {derived.constraints.warnings.map((w,i)=>(
            <div key={i}>{w}</div>
          ))}
        </div>
      )}

    </div>
  );
}
