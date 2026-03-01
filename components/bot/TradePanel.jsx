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

/* ===================================================== */

export default function TradePanel({
  price = 66744,
  balanceQuote = 0,
  balanceBase = 0,
  quoteSymbol = "EUR",
  baseSymbol = "BTC",
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
  const [orderType, setOrderType] = useState("limit"); // limit | market | tpsl
  const [orderPrice, setOrderPrice] = useState(num(price, 0));

  const [amountPct, setAmountPct] = useState(25);
  const [sizeMode, setSizeMode] = useState("quote"); // quote | base
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useTpSl, strategyStop, strategyTarget]);

  /* =========================
     Effective price
  ========================= */
  const effectivePrice = useMemo(() => {
    if (orderType === "market") return num(price, null);
    return num(orderPrice, null);
  }, [orderType, price, orderPrice]);

  // ✅ Zorg dat LIMIT default prijs meebeweegt als je nog niet zelf hebt getypt
  useEffect(() => {
    const live = num(price, null);
    if (!live) return;

    // Als je in market zit, hoef je niets te doen (we tonen live price)
    if (orderType === "market") return;

    // Als orderPrice nog "leeg/0" is, vul met live
    const current = num(orderPrice, null);
    if (!current || current <= 0) setOrderPrice(live);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, orderType]);

  /* =========================
     Max qty
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
     Risk Preview
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

    const v = num(orderValueQuote, null);

    if (side === "buy") {
      if (v == null) return { ok: false, reason: "Orderwaarde onbekend" };
      if (v > num(balanceQuote, 0)) return { ok: false, reason: "Onvoldoende saldo" };
    }

    if (side === "sell" && q > num(balanceBase, 0))
      return { ok: false, reason: "Onvoldoende BTC" };

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
  ]);

  const canSubmit = validation.ok && !loading;

  /* =========================
     ✅ Sync: slider -> input (als user niet typt)
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
     ✅ Sync: input -> slider (als user typt)
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
     ✅ Toggle EUR/BTC: convert + clear
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
     ✅ Order type switch: small guards
  ========================= */
  const handleSetOrderType = (type) => {
    setOrderType(type);

    // Als je naar market gaat: laat LIMIT prijs staan, we tonen live price toch.
    // Als je teruggaat naar limit: orderPrice blijft behouden.
  };

  /* =========================
     Submit
  ========================= */
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
        <div className="text-xs text-right">
          <div className="opacity-80">Beschikbaar saldo</div>
          {side === "buy" ? (
            <div className="font-semibold">
              {fmt(balanceQuote)} {quoteSymbol}
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
          type="button"
          onClick={() => setSide("buy")}
          className={side === "buy" ? "active-buy" : ""}
        >
          <ArrowUpCircle size={18} />
          Kopen
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={side === "sell" ? "active-sell" : ""}
        >
          <ArrowDownCircle size={18} />
          Verkopen
        </button>
      </div>

      {/* ORDER TYPE */}
      <div className="flex gap-2 text-sm">
        {["limit", "market", "tpsl"].map((type) => (
          <button
            type="button"
            key={type}
            onClick={() => handleSetOrderType(type)}
            className={`trade-tab ${orderType === type ? "active" : ""}`}
          >
            {type === "tpsl" ? "TP/SL" : type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PRICE */}
      <div>
        <label className="text-sm">Prijs</label>
        <input
          type="number"
          value={orderType === "market" ? num(price, "") : orderPrice}
          disabled={orderType === "market"}
          onChange={(e) => setOrderPrice(Number(e.target.value))}
          className="trade-input mt-1"
        />
      </div>

      {/* AMOUNT */}
      <div className="trade-surface p-3 space-y-3">
        <div className="flex justify-between">
          <div className="font-semibold">Aantal</div>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => toggleSizeMode("quote")}
              className={`trade-tab ${sizeMode === "quote" ? "active" : ""}`}
            >
              In {quoteSymbol}
            </button>
            <button
              type="button"
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
            // slider wordt bron -> typed velden leeg
            setAmountQuoteInput("");
            setAmountBaseInput("");
          }}
          className="trade-slider"
        />

        <div className="text-sm flex justify-between">
          <div>
            {fmt(qtyBase, 6)} {baseSymbol}
          </div>
          <div>
            Max: {fmt(maxQtyBase, 6)} {baseSymbol}
          </div>
        </div>
      </div>

      {/* ORDER VALUE */}
      <div className="trade-surface p-3">
        <div className="text-xs">Orderwaarde</div>
        <div className="text-lg font-semibold">
          {orderValueQuote == null ? "—" : `${fmt(orderValueQuote)} ${quoteSymbol}`}
        </div>
      </div>

      {/* TP/SL */}
      {useTpSl && (
        <div className="trade-surface p-3 space-y-3">
          <div className="font-semibold">TP / SL</div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Take profit"
              value={tpPrice}
              onChange={(e) => setTpPrice(e.target.value)}
              className="trade-input"
            />
            <input
              type="number"
              placeholder="Stop loss"
              value={slPrice}
              onChange={(e) => setSlPrice(e.target.value)}
              className="trade-input"
            />
          </div>

          {(riskPct || rrRatio) && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>Risk: {riskPct ? `${riskPct}%` : "—"}</span>
              </div>
              <div>R/R: {rrRatio || "—"}</div>
            </div>
          )}
        </div>
      )}

      {/* ERROR (backend / container) */}
      {error && <div className="trade-badge-bad">{error}</div>}

      {/* VALIDATION */}
      <div className="text-xs">
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
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`trade-submit ${side === "buy" ? "buy" : "sell"}`}
      >
        {loading ? "Plaatsen..." : "Plaats order"}
      </button>
    </div>
  );
}
