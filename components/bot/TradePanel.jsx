"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* =========================
   Helpers
========================= */
const num = (v, d = null) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const fmt = (v, digits = 2) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("nl-NL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * TradePanel — Binance-style (paper/manual)
 *
 * Props:
 * - price: live prijs
 * - balanceQuote: beschikbaar saldo quote (EUR/USDC)
 * - balanceBase: beschikbaar saldo base (BTC)
 * - quoteSymbol: "USDC" of "EUR"
 * - baseSymbol: "BTC"
 * - watchLevels: { pullback_zone/pullback, breakout_trigger/breakout }
 * - strategy: { stop_loss, targets }
 * - symbol: default "BTC"
 * - loading: boolean (optional)
 * - error: string (optional)
 * - onSubmit(payload)
 *   payload = {
 *     symbol,
 *     side: "buy"|"sell",
 *     orderType: "limit"|"market"|"stop"|"tpsl",
 *     quantity: number,        // in BASE (BTC)
 *     value_eur: number,       // in QUOTE (EUR/USDC)
 *     size_mode: "base"|"quote",
 *     price: number,           // used price
 *     tp, sl, stop_trigger
 *   }
 */
export default function TradePanel({
  price = 66744,
  balanceQuote = 0,
  balanceBase = 0,
  quoteSymbol = "USDC",
  baseSymbol = "BTC",
  watchLevels = {},
  strategy = {},
  symbol = "BTC",
  loading = false,
  error = null,
  onSubmit,
}) {
  /* =========================
     State
  ========================= */
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("limit"); // limit | market | stop | tpsl
  const [orderPrice, setOrderPrice] = useState(num(price, 0));

  const [stopTrigger, setStopTrigger] = useState("");

  const [amountPct, setAmountPct] = useState(25);
  const [sizeMode, setSizeMode] = useState("quote"); // quote | base
  const [amountQuoteInput, setAmountQuoteInput] = useState("");
  const [amountBaseInput, setAmountBaseInput] = useState("");

  const [tpPrice, setTpPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");

  const useTpSl = orderType === "tpsl";

  /* =========================
     Watch levels (robust keys)
  ========================= */
  const pullback = useMemo(() => {
    return (
      num(watchLevels?.pullback, null) ??
      num(watchLevels?.pullback_zone, null) ??
      null
    );
  }, [watchLevels]);

  const breakout = useMemo(() => {
    return (
      num(watchLevels?.breakout, null) ??
      num(watchLevels?.breakout_trigger, null) ??
      null
    );
  }, [watchLevels]);

  /* =========================
     Strategy defaults
  ========================= */
  const strategyStop = useMemo(() => {
    const s = strategy?.stop_loss;
    if (!s) return null;
    return typeof s === "object" ? num(s.price, null) : num(s, null);
  }, [strategy]);

  const strategyTarget = useMemo(() => {
    const t = strategy?.targets?.[0];
    if (!t) return null;
    return typeof t === "object" ? num(t.price, null) : num(t, null);
  }, [strategy]);

  useEffect(() => {
    if (!useTpSl) return;

    // only set if empty (so we don't overwrite user edits)
    if (slPrice === "" && strategyStop) setSlPrice(String(strategyStop));
    if (tpPrice === "" && strategyTarget) setTpPrice(String(strategyTarget));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useTpSl, strategyStop, strategyTarget]);

  /* =========================
     Effective price
  ========================= */
  const effectivePrice = useMemo(() => {
    if (orderType === "market") return num(price, null);
    return num(orderPrice, null);
  }, [orderType, price, orderPrice]);

  /* =========================
     Max qty base
  ========================= */
  const maxQtyBase = useMemo(() => {
    const p = num(effectivePrice, null);
    if (!p) return 0;

    return side === "buy"
      ? Math.max(0, num(balanceQuote, 0) / p)
      : Math.max(0, num(balanceBase, 0));
  }, [side, balanceQuote, balanceBase, effectivePrice]);

  const qtyFromPct = useMemo(() => {
    return (maxQtyBase * clamp(amountPct, 0, 100)) / 100;
  }, [maxQtyBase, amountPct]);

  /* =========================
     Quantity base (single source of truth)
  ========================= */
  const qtyBase = useMemo(() => {
    const p = num(effectivePrice, null);
    if (!p) return 0;

    // user typed BASE
    if (sizeMode === "base" && amountBaseInput !== "")
      return Math.max(0, num(amountBaseInput, 0));

    // user typed QUOTE
    if (sizeMode === "quote" && amountQuoteInput !== "")
      return Math.max(0, num(amountQuoteInput, 0) / p);

    // slider fallback
    return qtyFromPct;
  }, [
    effectivePrice,
    sizeMode,
    amountBaseInput,
    amountQuoteInput,
    qtyFromPct,
  ]);

  const orderValueQuote = useMemo(() => {
    const p = num(effectivePrice, null);
    if (!p) return null;
    return qtyBase * p;
  }, [qtyBase, effectivePrice]);

  /* =========================
     Risk Preview (alleen bij TP/SL)
  ========================= */
  const riskPct = useMemo(() => {
    if (!useTpSl) return null;

    const p = num(effectivePrice, null);
    const sl = num(slPrice, null);
    if (!p || !sl) return null;

    const risk =
      side === "buy" ? ((p - sl) / p) * 100 : ((sl - p) / p) * 100;

    return Math.abs(risk).toFixed(2);
  }, [useTpSl, effectivePrice, slPrice, side]);

  const rrRatio = useMemo(() => {
    if (!useTpSl) return null;

    const p = num(effectivePrice, null);
    const sl = num(slPrice, null);
    const tp = num(tpPrice, null);
    if (!p || !sl || !tp) return null;

    const reward = side === "buy" ? tp - p : p - tp;
    const risk = side === "buy" ? p - sl : sl - p;

    if (risk <= 0) return null;

    return (reward / risk).toFixed(2);
  }, [useTpSl, effectivePrice, slPrice, tpPrice, side]);

  /* =========================
     Validation
  ========================= */
  const validation = useMemo(() => {
    const p = num(effectivePrice, null);
    const q = num(qtyBase, null);

    if (!p) return { ok: false, reason: "Geen geldige prijs" };
    if (!q || q <= 0) return { ok: false, reason: "Aantal is 0" };

    if (side === "buy") {
      const v = num(orderValueQuote, null);
      if (!v && v !== 0) return { ok: false, reason: "Orderwaarde onbekend" };
      if (v > num(balanceQuote, 0)) return { ok: false, reason: "Onvoldoende saldo" };
    }

    if (side === "sell" && q > num(balanceBase, 0))
      return { ok: false, reason: "Onvoldoende BTC" };

    if (orderType === "stop") {
      const st = num(stopTrigger, null);
      if (!st) return { ok: false, reason: "Stop trigger verplicht" };
    }

    if (useTpSl) {
      const tp = num(tpPrice, null);
      const sl = num(slPrice, null);
      if (!tp || !sl) return { ok: false, reason: "TP/SL verplicht" };

      if (side === "buy" && !(tp > p && sl < p))
        return { ok: false, reason: "TP/SL niet logisch" };

      if (side === "sell" && !(tp < p && sl > p))
        return { ok: false, reason: "TP/SL niet logisch" };
    }

    return { ok: true };
  }, [
    effectivePrice,
    qtyBase,
    orderValueQuote,
    balanceQuote,
    balanceBase,
    useTpSl,
    tpPrice,
    slPrice,
    side,
    orderType,
    stopTrigger,
  ]);

  const canSubmit = validation.ok && !loading;

  /* =========================
     Keep typed inputs in sync when slider moves
     (only if user did not type a value in that mode)
  ========================= */
  useEffect(() => {
    const p = num(effectivePrice, null);
    if (!p || p <= 0) return;

    if (sizeMode === "base") {
      if (amountBaseInput === "") {
        const q = qtyFromPct;
        setAmountBaseInput(q > 0 ? String(Number(q.toFixed(6))) : "");
      }
    } else {
      if (amountQuoteInput === "") {
        const v = qtyFromPct * p;
        setAmountQuoteInput(v > 0 ? String(Number(v.toFixed(2))) : "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qtyFromPct, effectivePrice, sizeMode]);

  /* =========================
     When toggling sizeMode:
     - convert the "current order" into the other input field
     - clear the previous typed field so you don't get double sources
  ========================= */
  const toggleSizeMode = (nextMode) => {
    const p = num(effectivePrice, null);
    if (!p || p <= 0) {
      setSizeMode(nextMode);
      return;
    }

    if (nextMode === "base") {
      setAmountBaseInput(qtyBase > 0 ? String(Number(qtyBase.toFixed(6))) : "");
      setAmountQuoteInput("");
    } else {
      const v = qtyBase * p;
      setAmountQuoteInput(v > 0 ? String(Number(v.toFixed(2))) : "");
      setAmountBaseInput("");
    }

    setSizeMode(nextMode);
  };

  /* =========================
     Update slider when user types
  ========================= */
  useEffect(() => {
    if (maxQtyBase <= 0) return;

    if (sizeMode === "base" && amountBaseInput !== "") {
      const q = Math.max(0, num(amountBaseInput, 0));
      const pct = (q / maxQtyBase) * 100;
      setAmountPct(clamp(pct, 0, 100));
    }

    if (sizeMode === "quote" && amountQuoteInput !== "") {
      const p = num(effectivePrice, null);
      if (!p || p <= 0) return;

      const v = Math.max(0, num(amountQuoteInput, 0));
      const q = v / p;
      const pct = (q / maxQtyBase) * 100;
      setAmountPct(clamp(pct, 0, 100));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountBaseInput, amountQuoteInput, sizeMode, maxQtyBase, effectivePrice]);

  /* =========================
     Actions
  ========================= */
  const handleQuickSetPrice = (v) => {
    const p = num(v, null);
    if (!p) return;
    setOrderPrice(p);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const p = num(effectivePrice, null);
    const q = num(qtyBase, null);
    const v = num(orderValueQuote, null);

    onSubmit?.({
      symbol,
      side,
      orderType,
      quantity: q,
      value_eur: v,
      size_mode: sizeMode,
      price: p,
      tp: useTpSl ? num(tpPrice, null) : null,
      sl: useTpSl ? num(slPrice, null) : null,
      stop_trigger: orderType === "stop" ? num(stopTrigger, null) : null,
    });
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="trade-panel p-5 w-full max-w-md space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Trade</h2>

        <div className="text-xs text-[var(--text-muted)] text-right">
          <div className="opacity-80">Beschikbaar saldo</div>
          {side === "buy" ? (
            <div className="font-semibold">
              {fmt(balanceQuote, 2)} {quoteSymbol}
            </div>
          ) : (
            <div className="font-semibold">
              {fmt(balanceBase, 6)} {baseSymbol}
            </div>
          )}
        </div>
      </div>

      {/* BUY / SELL */}
      <div className="trade-segment">
        <button
          onClick={() => setSide("buy")}
          className={side === "buy" ? "active-buy" : ""}
        >
          <ArrowUpCircle size={18} />
          Kopen
        </button>

        <button
          onClick={() => setSide("sell")}
          className={side === "sell" ? "active-sell" : ""}
        >
          <ArrowDownCircle size={18} />
          Verkopen
        </button>
      </div>

      {/* ORDER TYPE */}
      <div className="flex gap-2 text-sm">
        {["limit", "market", "stop", "tpsl"].map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={`trade-tab ${orderType === type ? "active" : ""}`}
          >
            {type === "tpsl" ? "TP/SL" : type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PRICE INPUT */}
      <div>
        <label className="text-sm text-[var(--text-muted)]">Prijs</label>
        <input
          type="number"
          value={orderType === "market" ? num(price, "") : orderPrice}
          disabled={orderType === "market"}
          onChange={(e) => setOrderPrice(Number(e.target.value))}
          className="trade-input mt-1"
        />

        <div className="flex gap-2 mt-2 text-xs">
          <button
            onClick={() => pullback && handleQuickSetPrice(pullback)}
            className="trade-tab"
            disabled={!pullback || orderType === "market"}
          >
            Pullback
          </button>

          <button
            onClick={() => breakout && handleQuickSetPrice(breakout)}
            className="trade-tab"
            disabled={!breakout || orderType === "market"}
          >
            Breakout
          </button>

          <button
            onClick={() => handleQuickSetPrice(price)}
            className="trade-tab"
            disabled={!num(price, null) || orderType === "market"}
          >
            Markt
          </button>
        </div>

        {orderType === "stop" && (
          <div className="mt-3">
            <label className="text-sm text-[var(--text-muted)]">
              Stop trigger
            </label>
            <input
              type="number"
              value={stopTrigger}
              onChange={(e) => setStopTrigger(e.target.value)}
              className="trade-input mt-1"
            />
          </div>
        )}
      </div>

      {/* AMOUNT */}
      <div className="trade-surface p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Aantal</div>

          <div className="flex gap-2 text-xs">
            <button
              onClick={() => toggleSizeMode("quote")}
              className={`trade-tab ${sizeMode === "quote" ? "active" : ""}`}
            >
              In {quoteSymbol}
            </button>
            <button
              onClick={() => toggleSizeMode("base")}
              className={`trade-tab ${sizeMode === "base" ? "active" : ""}`}
            >
              In {baseSymbol}
            </button>
          </div>
        </div>

        {sizeMode === "quote" ? (
          <input
            type="number"
            value={amountQuoteInput}
            onChange={(e) => setAmountQuoteInput(e.target.value)}
            className="trade-input"
          />
        ) : (
          <input
            type="number"
            value={amountBaseInput}
            onChange={(e) => setAmountBaseInput(e.target.value)}
            className="trade-input"
          />
        )}

        <input
          type="range"
          min="0"
          max="100"
          value={amountPct}
          onChange={(e) => {
            setAmountPct(Number(e.target.value));
            // clear typed field so slider becomes the source again
            if (sizeMode === "quote") setAmountQuoteInput("");
            if (sizeMode === "base") setAmountBaseInput("");
          }}
          className="trade-slider"
        />

        <div className="text-sm flex justify-between">
          <div>
            {fmt(qtyBase, 6)} {baseSymbol}
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            Max: {fmt(maxQtyBase, 6)} {baseSymbol}
          </div>
        </div>
      </div>

      {/* ORDER VALUE */}
      <div className="trade-surface p-3">
        <div className="text-xs text-[var(--text-muted)]">Orderwaarde</div>
        <div className="text-lg font-semibold">
          {orderValueQuote == null
            ? "—"
            : `${fmt(orderValueQuote, 2)} ${quoteSymbol}`}
        </div>
      </div>

      {/* TP/SL INPUTS */}
      {useTpSl && (
        <div className="trade-surface p-3 space-y-3">
          <div className="text-sm font-semibold">TP / SL</div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--text-muted)]">Take profit</label>
              <input
                type="number"
                value={tpPrice}
                onChange={(e) => setTpPrice(e.target.value)}
                className="trade-input mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">Stop loss</label>
              <input
                type="number"
                value={slPrice}
                onChange={(e) => setSlPrice(e.target.value)}
                className="trade-input mt-1"
              />
            </div>
          </div>

          {(riskPct || rrRatio) && (
            <div className="flex justify-between items-center pt-2">
              <div>
                <div className="text-xs text-[var(--text-muted)]">Risk</div>
                <div className="font-semibold text-[var(--trade-sell)]">
                  {riskPct ? `${riskPct}%` : "—"}
                </div>
              </div>

              <div>
                <div className="text-xs text-[var(--text-muted)]">R/R</div>
                <div className="font-semibold text-[var(--trade-buy)]">
                  {rrRatio || "—"}
                </div>
              </div>

              <AlertTriangle size={20} className="icon-warning" />
            </div>
          )}
        </div>
      )}

      {/* ERROR */}
      {error && <div className="trade-badge-bad">{error}</div>}

      {/* VALIDATION */}
      <div className="flex items-center gap-2 text-xs">
        {validation.ok ? (
          <span className="trade-badge-ok flex items-center gap-1">
            <CheckCircle2 size={14} />
            Klaar om te plaatsen
          </span>
        ) : (
          <span className="trade-badge-bad flex items-center gap-1">
            <XCircle size={14} />
            {validation.reason}
          </span>
        )}
      </div>

      {/* ACTION */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`trade-submit ${side === "buy" ? "buy" : "sell"}`}
      >
        {loading ? "Plaatsen..." : "Plaats order"}
      </button>
    </div>
  );
}
