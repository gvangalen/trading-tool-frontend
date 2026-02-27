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

function Input({ value, onChange, placeholder = "", rightLabel = null, disabled = false }) {
  return (
    <div className="relative">
      <input
        disabled={disabled}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={[
          "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none",
          "focus:ring-2 focus:ring-indigo-200",
          disabled ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
      />
      {rightLabel && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
          {rightLabel}
        </div>
      )}
    </div>
  );
}

/**
 * TradePlanCard — EDIT + SAVE + PLACE PAPER TRADE
 *
 * Props:
 * - decision: backend decision (source of truth / watch mode / live price fallback)
 * - tradePlan: optional plan
 * - allowManual: enable manual entry
 * - onSave(draft): save edited plan
 * - onGenerate(): regenerate plan
 * - onPlaceManualOrder(payload): REQUIRED for paper trade
 *   payload: { bot_id, symbol, side, quantity, price }
 */
export default function TradePlanCard({
  tradePlan = null,
  decision = null,
  loading = false,
  isGenerating = false,
  onGenerate,
  onSave,
  allowManual = true,
  onPlaceManualOrder, // ✅ this is the paper-trade action
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => tradePlan || null);
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [placeBusy, setPlaceBusy] = useState(false);
  const [placeError, setPlaceError] = useState(null);

  // manual order UI
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("limit");
  const [limitPrice, setLimitPrice] = useState("");
  const [amountBtc, setAmountBtc] = useState("");

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
      num(d?.price) ??
      num(d?.spot_price) ??
      num(p?.market_price) ??
      num(p?.price) ??
      null
    );
  }, [decision, tradePlan]);

  useEffect(() => {
    if (!limitPrice && Number.isFinite(livePrice)) {
      setLimitPrice(String(livePrice));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePrice]);

  const derived = useMemo(() => {
    const fallbackPlan = draft || decision?.trade_plan || null;

    if (!fallbackPlan) {
      return {
        symbol: decision?.symbol || "BTC",
        side: decision?.action || "buy",
        entry_plan: [],
        stop_loss: { price: null },
        targets: [],
        risk: null,
        constraints: { within_budget: false, within_risk: false, warnings: [] },
        _ready: false,
      };
    }

    const entry = clampArr(fallbackPlan.entry_plan);
    const targets = clampArr(fallbackPlan.targets);

    const constraints = {
      within_budget: fallbackPlan.constraints?.within_budget ?? false,
      within_risk: fallbackPlan.constraints?.within_risk ?? false,
      max_risk_per_trade:
        fallbackPlan.constraints?.max_risk_per_trade ?? decision?.max_risk_per_trade,
      max_daily_allocation:
        fallbackPlan.constraints?.max_daily_allocation ?? decision?.max_daily_allocation,
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
      symbol: fallbackPlan.symbol || decision?.symbol || "BTC",
      side: fallbackPlan.side || decision?.action || "buy",
      stop_loss: fallbackPlan.stop_loss || { price: null },
    };
  }, [draft, decision]);

  const showWatchMode = decision?.monitoring === true;
  const watchLevels = decision?.watch_levels || {};
  const pullback = watchLevels.pullback_zone ?? watchLevels.pullback ?? null;
  const breakout = watchLevels.breakout_trigger ?? watchLevels.breakout ?? null;
  const monitoringActive = decision?.monitoring === true;
  const alertsActive = decision?.alerts_active === true;

  const symbol = (derived.symbol || decision?.symbol || "BTC").toUpperCase();
  const botId = decision?.bot_id ?? decision?.bot?.id ?? null;

  const priceForCalc = orderType === "market" ? num(livePrice, null) : num(limitPrice, null);
  const qty = num(amountBtc, null);
  const orderValueEur = qty && priceForCalc ? Math.max(0, qty * priceForCalc) : null;

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
      const base = ensureObj(draft || derived || {});
      const payload = {
        symbol: (base.symbol || "BTC").toUpperCase(),
        side: base.side || "buy",
        entry_plan: clampArr(base.entry_plan || []).map((e) => ({
          type: e.type || "buy",
          price: num(e.price, null),
        })),
        stop_loss: { price: num(base.stop_loss?.price, null) },
        targets: clampArr(base.targets || []).map((t, i) => ({
          label: t.label || `T${i + 1}`,
          price: num(t.price, null),
        })),
        risk: base.risk ?? null,
        constraints: base.constraints ?? {},
      };

      await onSave(payload);
      setEditing(false);
    } catch (e) {
      setSaveError(e?.message || "Opslaan mislukt");
      throw e;
    } finally {
      setSaveBusy(false);
    }
  };

  const handlePlacePaperTrade = async () => {
    if (!allowManual) return;
    if (!onPlaceManualOrder) {
      setPlaceError("Paper trade handler ontbreekt");
      return;
    }

    setPlaceError(null);
    setPlaceBusy(true);

    try {
      const price =
        orderType === "market" ? num(livePrice, null) : num(limitPrice, null);

      if (!botId) throw new Error("bot_id ontbreekt (decision.bot_id)");
      if (!qty || qty <= 0) throw new Error("Vul een aantal (BTC) in");
      if (!price || price <= 0) throw new Error("Geen geldige prijs");

      await onPlaceManualOrder({
        bot_id: botId,
        symbol,
        side,
        quantity: qty,
        price,
      });

      // reset minimal
      setAmountBtc("");
    } catch (e) {
      setPlaceError(e?.message || "Paper trade plaatsen mislukt");
      throw e;
    } finally {
      setPlaceBusy(false);
    }
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Bot size={18} />
            Trade Plan
          </div>
          <div className="text-sm text-gray-500">
            {symbol} · {(derived.side || "buy").toUpperCase()}
            {Number.isFinite(livePrice) && (
              <span className="ml-2 text-gray-400">• Live: €{fmtPrice(livePrice)}</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
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
                  <button onClick={handleSave} disabled={saveBusy} className="btn-primary flex gap-2">
                    <Save size={16} />
                    {saveBusy ? "Opslaan…" : "Opslaan"}
                  </button>
                  <button onClick={handleCancelEdit} className="btn-outline flex gap-2">
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

      {/* WATCH MODE */}
      {showWatchMode && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 space-y-2">
          <div className="font-semibold text-indigo-900">Bot wacht op entry</div>
          <div className="text-sm text-indigo-800 space-y-1">
            {pullback && <div>📉 Pullback zone: €{fmtPrice(pullback)}</div>}
            {breakout && <div>📈 Breakout trigger: €{fmtPrice(breakout)}</div>}
            {!pullback && !breakout && <div>Bot monitort de markt voor een entry trigger.</div>}
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
        <Badge ok={derived._ready} labelOk="klaar om te plaatsen" labelFail="niet klaar" />
        <Badge ok={derived.constraints.within_budget} labelOk="binnen budget" labelFail="budget limiet" />
        <Badge ok={derived.constraints.within_risk} labelOk="binnen risk limits" labelFail="risk limiet" />
      </div>

      {/* ENTRY / STOP / TARGETS / RISK (read-only weergave blijft, edit bouw je later door) */}
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

      <div className="rounded-xl border p-4">
        <SectionTitle icon={<Shield size={16} />} title="Stop Loss" />
        <div className="font-semibold">{fmtPrice(derived.stop_loss?.price)}</div>
      </div>

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

      <div className="rounded-xl border p-4 space-y-1">
        <SectionTitle icon={<AlertTriangle size={16} />} title="Risk" />
        <div className="text-sm text-gray-600">Risk: {fmtEur(derived.risk?.risk_eur)}</div>
        <div className="text-sm text-gray-600">R:R: {derived.risk?.rr ?? "—"}</div>
      </div>

      {/* PAPER TRADE PANEL */}
      {allowManual && (
        <div className="rounded-2xl border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900">Paper trade (manual)</div>
            <div className="text-xs text-gray-500">
              {symbol} • {orderType.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-xl overflow-hidden border">
            <button
              onClick={() => setSide("buy")}
              className={[
                "py-3 text-sm font-semibold",
                side === "buy" ? "bg-emerald-500 text-white" : "bg-white text-gray-600",
              ].join(" ")}
            >
              Kopen
            </button>
            <button
              onClick={() => setSide("sell")}
              className={[
                "py-3 text-sm font-semibold",
                side === "sell" ? "bg-red-500 text-white" : "bg-white text-gray-600",
              ].join(" ")}
            >
              Verkopen
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOrderType("limit")}
              className={[
                "px-3 py-2 rounded-xl border text-sm font-semibold",
                orderType === "limit" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700",
              ].join(" ")}
            >
              Limiet
            </button>
            <button
              onClick={() => setOrderType("market")}
              className={[
                "px-3 py-2 rounded-xl border text-sm font-semibold",
                orderType === "market" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700",
              ].join(" ")}
            >
              Markt
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-500">Prijs</div>
            <Input
              disabled={orderType === "market"}
              value={orderType === "market" ? (Number.isFinite(livePrice) ? fmtPrice(livePrice) : "") : limitPrice}
              onChange={(v) => setLimitPrice(v)}
              placeholder="bijv. 66744"
              rightLabel="EUR"
            />
            <div className="text-[11px] text-gray-500">
              Live: {Number.isFinite(livePrice) ? `€${fmtPrice(livePrice)}` : "—"}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-500">Aantal</div>
            <Input
              value={amountBtc}
              onChange={(v) => setAmountBtc(v)}
              placeholder="bijv. 0.01"
              rightLabel="BTC"
            />
          </div>

          <div className="rounded-xl border bg-gray-50 p-3 text-sm flex items-center justify-between">
            <span className="text-gray-600">Orderwaarde</span>
            <span className="font-semibold">{orderValueEur ? fmtEur(orderValueEur) : "—"}</span>
          </div>

          {placeError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {placeError}
            </div>
          )}

          <button
            onClick={handlePlacePaperTrade}
            disabled={placeBusy}
            className={[
              "w-full rounded-2xl py-3 text-sm font-semibold",
              side === "buy" ? "bg-emerald-500 text-white" : "bg-red-500 text-white",
              placeBusy ? "opacity-70" : "",
            ].join(" ")}
          >
            {placeBusy ? "Plaatsen…" : side === "buy" ? "Plaats BUY (paper)" : "Plaats SELL (paper)"}
          </button>
        </div>
      )}
    </div>
  );
}
