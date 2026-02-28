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
  Pencil,
  Save,
  X,
} from "lucide-react";

/* =========================
   Helpers
========================= */

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
const ensureObj = (v) => (v && typeof v === "object" ? v : {});

/* =========================
   UI Components
========================= */

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

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 font-semibold text-gray-900">
      {icon}
      <span>{title}</span>
    </div>
  );
}

/* =========================
   TradePlanCard
========================= */

export default function TradePlanCard({
  tradePlan = null,
  decision = null,
  loading = false,
  isGenerating = false,
  onGenerate,
  onSave,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => tradePlan || null);
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!editing) setDraft(tradePlan || null);
  }, [tradePlan, editing]);

  const livePrice = useMemo(() => {
    const d = ensureObj(decision);
    const p = ensureObj(tradePlan);
    return (
      num(d?.live_price) ??
      num(d?.last_price) ??
      num(d?.market_price) ??
      num(p?.market_price) ??
      null
    );
  }, [decision, tradePlan]);

  const derived = useMemo(() => {
    const fallbackPlan = draft || decision?.trade_plan || null;

    if (!fallbackPlan) {
      return {
        symbol: decision?.symbol || "BTC",
        side: decision?.action || "observe",
        entry_plan: [],
        stop_loss: { price: null },
        targets: [],
        risk: null,
        constraints: { within_budget: false, within_risk: false },
        _ready: false,
      };
    }

    const entry = clampArr(fallbackPlan.entry_plan);
    const targets = clampArr(fallbackPlan.targets);

    const constraints = {
      within_budget: fallbackPlan.constraints?.within_budget ?? false,
      within_risk: fallbackPlan.constraints?.within_risk ?? false,
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
      symbol: fallbackPlan.symbol || decision?.symbol || "BTC",
      side: fallbackPlan.side || decision?.action || "observe",
      stop_loss: fallbackPlan.stop_loss || { price: null },
    };
  }, [draft, decision]);

  const symbol = (derived.symbol || "BTC").toUpperCase();

  /* ================= SAVE ================= */

  const handleStartEdit = () => {
    setSaveError(null);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setSaveError(null);
    setEditing(false);
    setDraft(tradePlan || null);
  };

  const handleSave = async () => {
    if (!onSave) return;

    setSaveError(null);
    setSaveBusy(true);

    try {
      await onSave(draft);
      setEditing(false);
    } catch (e) {
      setSaveError(e?.message || "Opslaan mislukt");
      throw e;
    } finally {
      setSaveBusy(false);
    }
  };

  /* ================= RENDER ================= */

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
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Bot size={18} />
            Trade Plan
          </div>
          <div className="text-sm text-gray-500">
            {symbol} · {(derived.side || "observe").toUpperCase()}
            {Number.isFinite(livePrice) && (
              <span className="ml-2 text-gray-400">
                • Live: €{fmtPrice(livePrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onGenerate && (
            <button onClick={onGenerate} className="btn-outline flex gap-2">
              <RotateCcw size={16} />
              {isGenerating ? "Genereren…" : "Genereer"}
            </button>
          )}

          {onSave && (
            <>
              {!editing ? (
                <button onClick={handleStartEdit} className="btn-outline flex gap-2">
                  <Pencil size={16} />
                  Bewerk
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saveBusy}
                    className="btn-primary flex gap-2"
                  >
                    <Save size={16} />
                    {saveBusy ? "Opslaan…" : "Opslaan"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn-outline flex gap-2"
                  >
                    <X size={16} />
                    Annuleer
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {saveError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {saveError}
        </div>
      )}

      {/* BADGES */}
      <div className="flex flex-wrap gap-2">
        <Badge ok={derived._ready} labelOk="klaar om te plaatsen" labelFail="niet klaar" />
        <Badge ok={derived.constraints.within_budget} labelOk="binnen budget" labelFail="budget limiet" />
        <Badge ok={derived.constraints.within_risk} labelOk="binnen risk limits" labelFail="risk limiet" />
      </div>

      {/* ENTRY */}
      <div className="rounded-xl border p-4 space-y-3">
        <SectionTitle icon={<TrendingUp size={16} />} title="Entry Plan" />
        {derived.entry_plan.length === 0 ? (
          <div className="text-sm text-gray-500">—</div>
        ) : (
          derived.entry_plan.map((e, i) => (
            <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-lg">
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
      <div className="rounded-xl border p-4 space-y-2">
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
