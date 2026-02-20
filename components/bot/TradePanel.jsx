"use client";

import { useState, useMemo } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
} from "lucide-react";

/**
 * TradePanel
 *
 * Props:
 * - price (number) -> huidige marktprijs
 * - watchLevels { breakout, pullback, invalidate }
 * - strategy { stop_loss, targets[] }
 * - balance (number)
 */

export default function TradePanel({
  price = 66744,
  balance = 1000,
  watchLevels = {
    breakout: 68200,
    pullback: 62100,
    invalidate: 59900,
  },
  strategy = {
    stop_loss: 59900,
    targets: [70500, 72000],
  },
}) {
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("limit");
  const [orderPrice, setOrderPrice] = useState(price);
  const [amountPct, setAmountPct] = useState(25);

  const amountBTC = useMemo(() => {
    const eur = (balance * amountPct) / 100;
    return eur / orderPrice;
  }, [amountPct, orderPrice, balance]);

  const orderValue = amountBTC * orderPrice;

  const stopLoss = strategy?.stop_loss;
  const targets = strategy?.targets || [];

  const riskPct = useMemo(() => {
    if (!stopLoss) return null;
    const risk = ((orderPrice - stopLoss) / orderPrice) * 100;
    return Math.abs(risk).toFixed(2);
  }, [orderPrice, stopLoss]);

  const rrRatio = useMemo(() => {
    if (!targets.length || !stopLoss) return null;
    const reward = targets[0] - orderPrice;
    const risk = orderPrice - stopLoss;
    if (risk <= 0) return null;
    return (reward / risk).toFixed(2);
  }, [targets, orderPrice, stopLoss]);

  return (
    <div className="bg-[#0b0f1a] text-white rounded-2xl p-5 w-full max-w-md space-y-5 shadow-xl">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Trade</h2>
      </div>

      {/* BUY / SELL */}
      <div className="flex bg-[#111827] rounded-xl p-1">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
            side === "buy"
              ? "bg-green-600"
              : "text-gray-400"
          }`}
        >
          <ArrowUpCircle size={18} />
          Kopen
        </button>

        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
            side === "sell"
              ? "bg-red-600"
              : "text-gray-400"
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
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PRICE INPUT */}
      <div>
        <label className="text-gray-400 text-sm">Prijs</label>
        <input
          type="number"
          value={orderPrice}
          onChange={(e) => setOrderPrice(Number(e.target.value))}
          className="w-full mt-1 bg-[#111827] p-3 rounded-lg outline-none"
        />

        <div className="flex gap-2 mt-2 text-xs">
          <button
            onClick={() => setOrderPrice(watchLevels.pullback)}
            className="bg-[#111827] px-3 py-1 rounded"
          >
            Pullback
          </button>
          <button
            onClick={() => setOrderPrice(watchLevels.breakout)}
            className="bg-[#111827] px-3 py-1 rounded"
          >
            Breakout
          </button>
          <button
            onClick={() => setOrderPrice(price)}
            className="bg-[#111827] px-3 py-1 rounded"
          >
            Markt
          </button>
        </div>
      </div>

      {/* AMOUNT */}
      <div>
        <label className="text-gray-400 text-sm">
          Amount ({amountPct}%)
        </label>

        <input
          type="range"
          min="1"
          max="100"
          value={amountPct}
          onChange={(e) => setAmountPct(e.target.value)}
          className="w-full mt-2"
        />

        <div className="flex justify-between text-xs text-gray-400">
          <span>0%</span>
          <span>100%</span>
        </div>

        <div className="mt-2 text-sm">
          {amountBTC.toFixed(5)} BTC
        </div>
      </div>

      {/* ORDER VALUE */}
      <div className="bg-[#111827] p-3 rounded-lg">
        <div className="text-gray-400 text-xs">Orderwaarde</div>
        <div className="text-lg font-semibold">
          € {orderValue.toFixed(2)}
        </div>
      </div>

      {/* STOP LOSS */}
      {stopLoss && (
        <div className="bg-[#111827] p-3 rounded-lg">
          <div className="text-gray-400 text-xs">Stop Loss</div>
          <div className="text-red-400 font-semibold">
            € {stopLoss}
          </div>
        </div>
      )}

      {/* TARGETS */}
      {targets.length > 0 && (
        <div className="bg-[#111827] p-3 rounded-lg">
          <div className="text-gray-400 text-xs">Targets</div>
          {targets.map((t, i) => (
            <div key={i} className="text-green-400">
              € {t}
            </div>
          ))}
        </div>
      )}

      {/* RISK PREVIEW */}
      {riskPct && (
        <div className="bg-[#111827] p-3 rounded-lg flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400">Risk</div>
            <div className="text-red-400 font-semibold">
              {riskPct}%
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400">R/R</div>
            <div className="text-green-400 font-semibold">
              {rrRatio || "-"}
            </div>
          </div>

          <AlertTriangle className="text-yellow-400" size={20} />
        </div>
      )}

      {/* ACTIONS */}
      <div className="space-y-2">
        <button className="w-full bg-[#111827] py-3 rounded-lg hover:bg-[#1f2937]">
          Simuleer trade
        </button>

        <button
          className={`w-full py-3 rounded-lg font-semibold ${
            side === "buy"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Plaats order
        </button>
      </div>
    </div>
  );
}
