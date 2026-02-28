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
 * - price: live prijs (EUR/USDC) voor quick "Markt"
 * - balanceQuote: beschikbaar saldo in quote (bijv USDC/EUR)
 * - balanceBase: beschikbaar saldo in base (bijv BTC)
 * - quoteSymbol: "USDC" of "EUR"
 * - baseSymbol: "BTC"
 * - watchLevels: { pullback_zone / pullback, breakout_trigger / breakout }
 * - strategy: { stop_loss, targets } (kan numbers of objects zijn)
 * - onSubmit(payload)
 *   payload = {
 *     side: "buy"|"sell",
 *     orderType: "limit"|"market"|"stop",
 *     symbol,
 *     quantity,      // in BASE (BTC)
 *     price,         // price used (EUR/USDC per BTC)
 *     tp,            // optional take profit price
 *     sl,            // optional stop loss price
 *   }
 */
export default function TradePanel({
  price = 66744,
  balanceQuote = 0, // bijv USDC/EUR saldo
  balanceBase = 0,  // bijv BTC saldo
  quoteSymbol = "USDC",
  baseSymbol = "BTC",
  watchLevels = {},
  strategy = {},
  symbol = "BTC",
  onSubmit,
}) {
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("limit"); // limit | market | stop

  const [orderPrice, setOrderPrice] = useState(num(price, 0));
  const [stopTrigger, setStopTrigger] = useState(""); // alleen voor stop orders

  // slider = percentage van max allocatie (quote bij buy, base bij sell)
  const [amountPct, setAmountPct] = useState(25);

  // TP/SL toggle
  const [useTpSl, setUseTpSl] = useState(false);
  const [tpPrice, setTpPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");

  /* =========================
     Watch levels normalize
  ========================= */
  const pullback =
    watchLevels?.pullback_zone ??
    watchLevels?.pullback ??
    watchLevels?.pb ??
    null;

  const breakout =
    watchLevels?.breakout_trigger ??
    watchLevels?.breakout ??
    watchLevels?.bo ??
    null;

  /* =========================
     Strategy-derived TP/SL defaults (optioneel)
  ========================= */
  const strategyStop = useMemo(() => {
    // accepteer number of {price}
    const s = strategy?.stop_loss;
    if (s == null) return null;
    if (typeof s === "object") return num(s.price, null);
    return num(s, null);
  }, [strategy]);

  const strategyTargets = useMemo(() => {
    const t = strategy?.targets;
    if (!Array.isArray(t)) return [];
    // accepteer numbers of {price}
    return t
      .map((x) => (typeof x === "object" ? num(x.price, null) : num(x, null)))
      .filter((x) => Number.isFinite(x));
  }, [strategy]);

  // init price bij price update (alleen als user niet al bezig is)
  useEffect(() => {
    const p = num(price, null);
    if (!Number.isFinite(p)) return;
    // update orderPrice alleen als market of als huidige orderPrice leeg/0
    setOrderPrice((prev) => {
      if (orderType === "market") return p;
      if (!prev || prev <= 0) return p;
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  /* =========================
     Max allocatie / sizing
  ========================= */
  const effectivePrice = useMemo(() => {
    // market gebruikt live price
    if (orderType === "market") return num(price, null);
    return num(orderPrice, null);
  }, [orderType, price, orderPrice]);

  const maxQtyBase = useMemo(() => {
    // buy: max qty = balanceQuote / price
    // sell: max qty = balanceBase
    const p = num(effectivePrice, null);
    if (side === "buy") {
      if (!p || p <= 0) return 0;
      return Math.max(0, num(balanceQuote, 0) / p);
    }
    return Math.max(0, num(balanceBase, 0));
  }, [side, balanceQuote, balanceBase, effectivePrice]);

  const qtyBase = useMemo(() => {
    const pct = clamp(num(amountPct, 0), 0, 100);
    return (maxQtyBase * pct) / 100;
  }, [maxQtyBase, amountPct]);

  const orderValueQuote = useMemo(() => {
    const p = num(effectivePrice, null);
    if (!p || p <= 0) return null;
    return qtyBase * p;
  }, [qtyBase, effectivePrice]);

  /* =========================
     Risk preview (optioneel)
  ========================= */
  const riskPct = useMemo(() => {
    const p = num(effectivePrice, null);
    const sl = useTpSl ? num(slPrice, null) : strategyStop;

    if (!p || !sl) return null;

    // buy: SL onder entry
    // sell: SL boven entry
    const risk =
      side === "buy" ? ((p - sl) / p) * 100 : ((sl - p) / p) * 100;

    if (!Number.isFinite(risk)) return null;
    return Math.abs(risk).toFixed(2);
  }, [effectivePrice, slPrice, useTpSl, strategyStop, side]);

  const rrRatio = useMemo(() => {
    const p = num(effectivePrice, null);
    const sl = useTpSl ? num(slPrice, null) : strategyStop;
    const tp =
      useTpSl
        ? num(tpPrice, null)
        : (strategyTargets?.[0] ?? null);

    if (!p || !sl || !tp) return null;

    const reward = side === "buy" ? tp - p : p - tp;
    const risk = side === "buy" ? p - sl : sl - p;

    if (!Number.isFinite(reward) || !Number.isFinite(risk) || risk <= 0)
      return null;

    return (reward / risk).toFixed(2);
  }, [effectivePrice, slPrice, tpPrice, useTpSl, strategyStop, strategyTargets, side]);

  /* =========================
     Validatie / disabled
  ========================= */
  const validation = useMemo(() => {
    const p = num(effectivePrice, null);
    const q = num(qtyBase, null);

    if (!p || p <= 0) return { ok: false, reason: "Geen geldige prijs" };
    if (!q || q <= 0) return { ok: false, reason: "Aantal is 0" };

    if (side === "buy") {
      if (orderValueQuote == null || orderValueQuote <= 0)
        return { ok: false, reason: "Orderwaarde ongeldig" };
      if (orderValueQuote > num(balanceQuote, 0) + 1e-9)
        return { ok: false, reason: "Onvoldoende saldo" };
    } else {
      if (q > num(balanceBase, 0) + 1e-12)
        return { ok: false, reason: "Onvoldoende BTC" };
    }

    // stop order: trigger verplicht
    if (orderType === "stop") {
      const trig = num(stopTrigger, null);
      if (!trig || trig <= 0) return { ok: false, reason: "Stop trigger ontbreekt" };
    }

    // TP/SL validatie als toggle aan
    if (useTpSl) {
      const tp = num(tpPrice, null);
      const sl = num(slPrice, null);
      if (tpPrice && (!tp || tp <= 0)) return { ok: false, reason: "TP ongeldig" };
      if (slPrice && (!sl || sl <= 0)) return { ok: false, reason: "SL ongeldig" };

      // logische checks (optioneel)
      if (tp && sl) {
        if (side === "buy" && !(tp > p && sl < p))
          return { ok: false, reason: "TP/SL niet logisch t.o.v. entry" };
        if (side === "sell" && !(tp < p && sl > p))
          return { ok: false, reason: "TP/SL niet logisch t.o.v. entry" };
      }
    }

    return { ok: true, reason: null };
  }, [
    effectivePrice,
    qtyBase,
    side,
    orderType,
    stopTrigger,
    useTpSl,
    tpPrice,
    slPrice,
    orderValueQuote,
    balanceQuote,
    balanceBase,
  ]);

  const canSubmit = validation.ok && typeof onSubmit === "function";

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

    onSubmit?.({
      symbol,
      side,
      orderType,
      quantity: q,
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
    <div className="bg-[#0b0f1a] text-white rounded-2xl p-5 w-full max-w-md space-y-5 shadow-xl">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Trade</h2>

        {/* saldo rechts */}
        <div className="text-xs text-gray-300 text-right">
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
      <div className="flex bg-[#111827] rounded-xl p-1">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
            side === "buy" ? "bg-green-600" : "text-gray-400"
          }`}
        >
          <ArrowUpCircle size={18} />
          Kopen
        </button>

        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
            side === "sell" ? "bg-red-600" : "text-gray-400"
          }`}
        >
          <ArrowDownCircle size={18} />
          Verkopen
        </button>
      </div>

      {/* ORDER TYPE */}
      <div className="flex gap-2 text-sm">
        {["limit", "market", "stop"].map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={`px-3 py-1 rounded-lg ${
              orderType === type
                ? "bg-orange-500 text-black"
                : "bg-[#111827] text-gray-400"
            }`}
          >
            {type === "stop" ? "STOP" : type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PRICE INPUT */}
      <div>
        <label className="text-gray-400 text-sm">Prijs</label>
        <input
          type="number"
          value={orderType === "market" ? num(price, "") : orderPrice}
          disabled={orderType === "market"}
          onChange={(e) => setOrderPrice(Number(e.target.value))}
          className={`w-full mt-1 bg-[#111827] p-3 rounded-lg outline-none ${
            orderType === "market" ? "opacity-70 cursor-not-allowed" : ""
          }`}
        />

        <div className="flex gap-2 mt-2 text-xs">
          <button
            onClick={() => pullback && handleQuickSetPrice(pullback)}
            className="bg-[#111827] px-3 py-1 rounded"
            disabled={!pullback || orderType === "market"}
          >
            Pullback
          </button>

          <button
            onClick={() => breakout && handleQuickSetPrice(breakout)}
            className="bg-[#111827] px-3 py-1 rounded"
            disabled={!breakout || orderType === "market"}
          >
            Breakout
          </button>

          <button
            onClick={() => handleQuickSetPrice(price)}
            className="bg-[#111827] px-3 py-1 rounded"
            disabled={!num(price, null) || orderType === "market"}
          >
            Markt
          </button>
        </div>

        {/* STOP trigger */}
        {orderType === "stop" && (
          <div className="mt-3">
            <label className="text-gray-400 text-sm">Stop trigger</label>
            <input
              type="number"
              value={stopTrigger}
              onChange={(e) => setStopTrigger(e.target.value)}
              placeholder="bijv. 67000"
              className="w-full mt-1 bg-[#111827] p-3 rounded-lg outline-none"
            />
          </div>
        )}
      </div>

      {/* AMOUNT */}
      <div>
        <label className="text-gray-400 text-sm">
          Amount ({amountPct}%)
        </label>

        <input
          type="range"
          min="0"
          max="100"
          value={amountPct}
          onChange={(e) => setAmountPct(Number(e.target.value))}
          className="w-full mt-2"
        />

        <div className="mt-2 text-sm flex items-center justify-between">
          <div>
            {fmt(qtyBase, 6)} {baseSymbol}
          </div>
          <div className="text-xs text-gray-400">
            Max: {fmt(maxQtyBase, 6)} {baseSymbol}
          </div>
        </div>
      </div>

      {/* ORDER VALUE */}
      <div className="bg-[#111827] p-3 rounded-lg">
        <div className="text-gray-400 text-xs">Orderwaarde</div>
        <div className="text-lg font-semibold">
          {orderValueQuote == null ? "—" : `${fmt(orderValueQuote, 2)} ${quoteSymbol}`}
        </div>
        <div className="text-[11px] text-gray-500 mt-1">
          {side === "buy"
            ? `Max koopbedrag: ${fmt(balanceQuote, 2)} ${quoteSymbol}`
            : `Max verkoop: ${fmt(balanceBase, 6)} ${baseSymbol}`}
        </div>
      </div>

      {/* TP/SL */}
      <div className="bg-[#111827] p-3 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">TP/SL</div>
          <button
            onClick={() => {
              const next = !useTpSl;
              setUseTpSl(next);
              // prefill met strategy als beschikbaar
              if (next) {
                if (!tpPrice && strategyTargets?.[0]) setTpPrice(String(strategyTargets[0]));
                if (!slPrice && strategyStop) setSlPrice(String(strategyStop));
              }
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              useTpSl ? "bg-orange-500 text-black" : "bg-[#0b0f1a] text-gray-300"
            }`}
          >
            {useTpSl ? "Aan" : "Uit"}
          </button>
        </div>

        {useTpSl && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-400 mb-1">Take Profit</div>
              <input
                type="number"
                value={tpPrice}
                onChange={(e) => setTpPrice(e.target.value)}
                placeholder="TP prijs"
                className="w-full bg-[#0b0f1a] p-2 rounded-lg outline-none"
              />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
              <input
                type="number"
                value={slPrice}
                onChange={(e) => setSlPrice(e.target.value)}
                placeholder="SL prijs"
                className="w-full bg-[#0b0f1a] p-2 rounded-lg outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* RISK PREVIEW */}
      {(riskPct || rrRatio) && (
        <div className="bg-[#111827] p-3 rounded-lg flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400">Risk</div>
            <div className="text-red-400 font-semibold">
              {riskPct ? `${riskPct}%` : "—"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400">R/R</div>
            <div className="text-green-400 font-semibold">
              {rrRatio || "—"}
            </div>
          </div>

          <AlertTriangle className="text-yellow-400" size={20} />
        </div>
      )}

      {/* VALIDATION BADGE */}
      <div className="flex items-center gap-2 text-xs">
        {validation.ok ? (
          <span className="inline-flex items-center gap-1 text-emerald-300">
            <CheckCircle2 size={14} />
            Klaar om te plaatsen
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-red-300">
            <XCircle size={14} />
            {validation.reason}
          </span>
        )}
      </div>

      {/* ACTION */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          side === "buy"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        } ${!canSubmit ? "opacity-60 cursor-not-allowed hover:bg-none" : ""}`}
      >
        Plaats order
      </button>
    </div>
  );
}
