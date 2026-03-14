"use client";

import { useModal } from "@/components/modal/ModalProvider";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
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

/* ===================================================== */

export default function TradePanel({
  price = 66744,
  balanceQuote = 0,
  balanceBase = 0,
  availableQuote = balanceQuote,
  quoteSymbol = "EUR",
  baseSymbol = "BTC",
  strategy = {},
  symbol = "BTC",
  loading = false,
  error = null,
  onSubmit,
}) {

  const { showSnackbar } = useModal();
  
  /* =========================
     State
  ========================= */

  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("limit");

  // FIX: voorkomt 0 prijs init bug
  const [orderPrice, setOrderPrice] = useState(null);

  const [amountPct, setAmountPct] = useState(0);
  const [sizeMode, setSizeMode] = useState("quote");

  const [amountQuoteInput, setAmountQuoteInput] = useState("");
  const [amountBaseInput, setAmountBaseInput] = useState("");

  const [tpPrice, setTpPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");

  const useTpSl = orderType === "tpsl";

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

    if (slPrice === "" && strategyStop) setSlPrice(String(strategyStop));
    if (tpPrice === "" && strategyTarget) setTpPrice(String(strategyTarget));

  }, [useTpSl, strategyStop, strategyTarget]);

  /* =========================
     Effective price
  ========================= */

  const effectivePrice = useMemo(() => {
    if (orderType === "market") return num(price, null);
    return num(orderPrice, null);
  }, [orderType, price, orderPrice]);

  useEffect(() => {

    const live = num(price, null);
    if (!live) return;

    if (orderType === "market") return;

    const current = num(orderPrice, null);
    if (!current || current <= 0) {
      setOrderPrice(live);
    }

  }, [price, orderType]);

  /* =========================
     Max qty
  ========================= */

  const maxQtyBase = useMemo(() => {

    const p = num(effectivePrice, null);
    if (!p) return 0;

    return side === "buy"
      ? Math.max(0, num(availableQuote, 0) / p)
      : Math.max(0, num(balanceBase, 0));

  }, [side, availableQuote, balanceBase, effectivePrice]);

  const qtyFromPct = useMemo(() => {
    return (maxQtyBase * clamp(amountPct, 0, 100)) / 100;
  }, [maxQtyBase, amountPct]);

  /* =========================
     Quantity base
  ========================= */

  const qtyBase = useMemo(() => {

    const p = num(effectivePrice, null);
    if (!p) return 0;

    if (sizeMode === "base" && amountBaseInput !== "")
      return Math.max(0, num(amountBaseInput, 0));

    if (sizeMode === "quote" && amountQuoteInput !== "")
      return Math.max(0, num(amountQuoteInput, 0) / p);

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
     Balance check
  ========================= */

  const hasBalance = useMemo(() => {

    if (side === "buy") return num(availableQuote, 0) > 0;
    return num(balanceBase, 0) > 0;

  }, [side, availableQuote, balanceBase]);

  /* =========================
     Validation
  ========================= */

  const validation = useMemo(() => {

    if (!hasBalance)
      return { ok: false, reason: "Geen beschikbaar saldo" };

    const p = num(effectivePrice, null);
    const q = num(qtyBase, null);

    if (!p) return { ok: false, reason: "Geen geldige prijs" };
    if (!q || q <= 0) return { ok: false, reason: "Aantal is 0" };

    const v = num(orderValueQuote, null);

    if (side === "buy") {
      if (v == null) return { ok: false, reason: "Orderwaarde onbekend" };
      if (v > num(availableQuote, 0))
        return { ok: false, reason: "Onvoldoende saldo" };
    }

    if (side === "sell" && q > num(balanceBase, 0))
      return { ok: false, reason: "Onvoldoende BTC" };

    return { ok: true };

  }, [
    hasBalance,
    effectivePrice,
    qtyBase,
    orderValueQuote,
    balanceQuote,
    balanceBase,
    side,
  ]);

  const canSubmit = validation.ok && !loading;

  /* =========================
     Sync slider -> input
  ========================= */
useEffect(() => {

  const p = num(effectivePrice, null);
  if (!p || p <= 0) return;

  if (maxQtyBase <= 0) return;

  if (amountPct === 0) return;

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

}, [
  qtyFromPct,
  effectivePrice,
  sizeMode,
  maxQtyBase,
  amountPct,
  amountBaseInput,
  amountQuoteInput
]);

  /* =========================
     Toggle size mode
  ========================= */

  const toggleSizeMode = (nextMode) => {

    const p = num(effectivePrice, null);

    if (!p || p <= 0) {
      setSizeMode(nextMode);
      return;
    }

    if (nextMode === "base") {

      setAmountBaseInput(
        qtyBase > 0 ? String(Number(qtyBase.toFixed(6))) : ""
      );

      setAmountQuoteInput("");

    } else {

      const v = qtyBase * p;

      setAmountQuoteInput(
        v > 0 ? String(Number(v.toFixed(2))) : ""
      );

      setAmountBaseInput("");

    }

    setSizeMode(nextMode);

  };

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async () => {

  if (!canSubmit) return;

  const p = num(effectivePrice, null);
  const q = num(qtyBase, null);
  const v = num(orderValueQuote, null);

  try {

    const result = await onSubmit?.({
      symbol,
      side,
      orderType,
      quantity: q,
      value_eur: v,
      size_mode: sizeMode,
      price: p,
      tp: useTpSl ? num(tpPrice, null) : null,
      sl: useTpSl ? num(slPrice, null) : null,
    });

    // SUCCESS MESSAGE
    showSnackbar(
      `${side === "buy" ? "Koop" : "Verkoop"} order geplaatst ✔ ${fmt(q,6)} ${baseSymbol} @ ${fmt(p)}`,
      "success"
    );

    // 🔥 TRIGGER LIVE PORTFOLIO UPDATE
    window.dispatchEvent(new Event("portfolio:updated"));

    // RESET FORM
    setAmountPct(0);
    setAmountQuoteInput("");
    setAmountBaseInput("");

    setTpPrice("");
    setSlPrice("");

  } catch (err) {

    console.error("❌ Order error:", err);

    showSnackbar(
      err?.message || "Order plaatsen mislukt",
      "danger"
    );

  }

};

  /* =========================
     UI
  ========================= */

  return (
    <div className="trade-panel p-5 w-full max-w-md space-y-5">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h2 className="text-lg font-semibold">Trade</h2>

        <div className="text-xs text-right">

          <div className="opacity-80">Beschikbaar saldo</div>

          {side === "buy"
            ? (
              <div className="font-semibold">
                {fmt(availableQuote)} {quoteSymbol}
              </div>
            )
            : (
              <div className="font-semibold">
                {fmt(balanceBase,6)} {baseSymbol}
              </div>
            )
          }

        </div>

      </div>

      {/* BUY SELL */}

      <div className="trade-segment">

        <button
          type="button"
          onClick={() => setSide("buy")}
          className={side === "buy" ? "active-buy" : ""}
        >
          <ArrowUpCircle size={18}/>
          Kopen
        </button>

        <button
          type="button"
          onClick={() => setSide("sell")}
          className={side === "sell" ? "active-sell" : ""}
        >
          <ArrowDownCircle size={18}/>
          Verkopen
        </button>

      </div>

      {/* PRICE */}

      <div>

        <label className="text-sm">Prijs</label>

        <input
          type="number"
          value={orderType === "market" ? num(price,"") : orderPrice ?? ""}
          disabled={orderType === "market"}
          onChange={(e) => setOrderPrice(Number(e.target.value))}
          className="trade-input mt-1"
        />

      </div>

      {/* AMOUNT */}

      <div className="trade-surface p-3 space-y-3">

        {sizeMode === "quote"
          ? (
            <input
              type="number"
              value={amountQuoteInput}
              onChange={(e)=>setAmountQuoteInput(e.target.value)}
              className="trade-input"
            />
          )
          : (
            <input
              type="number"
              value={amountBaseInput}
              onChange={(e)=>setAmountBaseInput(e.target.value)}
              className="trade-input"
            />
          )
        }

        {/* =========================
           TRADING SLIDER
        ========================= */}
        
        <div className={`space-y-3 ${!hasBalance ? "opacity-40" : ""}`}>
        
          {/* Slider track */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        
            {/* Progress */}
            <div
              className="absolute h-full bg-green-500 transition-all duration-200"
              style={{ width: `${amountPct}%` }}
            />
        
            {/* Invisible range input */}
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={amountPct}
              disabled={!hasBalance}
              onChange={(e) => {
                setAmountPct(Number(e.target.value));
                setAmountQuoteInput("");
                setAmountBaseInput("");
              }}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
        
          </div>
        
          {/* Step markers */}
          <div className="relative flex justify-between items-center">
        
            {[0, 25, 50, 75, 100].map((step) => {
        
              const active = amountPct >= step;
        
              return (
                <button
                  key={step}
                  type="button"
                  disabled={!hasBalance}
                  onClick={() => {
                    setAmountPct(step);
                    setAmountQuoteInput("");
                    setAmountBaseInput("");
                  }}
                  className={`w-4 h-4 rounded-full border transition
                    ${active
                      ? "bg-green-500 border-green-500"
                      : "bg-gray-200 border-gray-300"
                    }`}
                />
              );
        
            })}
        
          </div>
        
          {/* Labels */}
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
        
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
        
          </div>

</div>

        {!hasBalance && (
          <div className="text-xs text-gray-400">
            {side === "buy"
              ? "Geen EUR beschikbaar om te kopen"
              : "Geen BTC beschikbaar om te verkopen"}
          </div>
        )}

        <div className="text-sm flex justify-between">
          <div>{fmt(qtyBase,6)} {baseSymbol}</div>
          <div>Max: {fmt(maxQtyBase,6)} {baseSymbol}</div>
        </div>

      </div>

      {/* ORDER VALUE */}

      <div className="trade-surface p-3">

        <div className="text-xs">Orderwaarde</div>

        <div className="text-lg font-semibold">
          {orderValueQuote == null
            ? "—"
            : `${fmt(orderValueQuote)} ${quoteSymbol}`
          }
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="trade-badge-bad">{error}</div>
      )}

      {/* VALIDATION */}

      <div className="text-xs">

        {validation.ok
          ? (
            <span className="trade-badge-ok flex items-center gap-1">
              <CheckCircle2 size={14}/>
              Klaar om te plaatsen
            </span>
          )
          : (
            <span className="trade-badge-bad flex items-center gap-1">
              <XCircle size={14}/>
              {validation.reason}
            </span>
          )
        }

      </div>

      {/* ACTION */}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`trade-submit ${side==="buy"?"buy":"sell"}`}
      >
        {loading ? "Plaatsen..." : "Plaats order"}
      </button>

    </div>
  );
}
