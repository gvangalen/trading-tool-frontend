"use client";

import { useMemo } from "react";
import {
  Bot,
  Target,
  Shield,
  TrendingUp,
  AlertTriangle,
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

const clampArr = (arr) => {
  if (Array.isArray(arr)) return arr;

  if (typeof arr === "string") {
    return arr.split(",").map((v) => Number(v.trim()));
  }

  return [];
};

/* =========================
   UI
========================= */

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 font-semibold text-gray-900">
      {icon}
      <span>{title}</span>
    </div>
  );
}

/* =========================
   TradePlanCard (READ ONLY)
========================= */

export default function TradePlanCard({
  tradePlan = null,
  decision = null,
  loading = false,
}) {
  const derived = useMemo(() => {
    const fallbackPlan = tradePlan || decision?.trade_plan || null;

    if (!fallbackPlan) {
      return {
        symbol: decision?.symbol || "BTC",
        side: decision?.action || "observe",
        entry_plan: [],
        stop_loss: { price: null },
        targets: [],
        risk: null,
      };
    }

    const normalizedTargets = clampArr(fallbackPlan.targets)
      .map((t, i) => {
        // number targets
        if (typeof t === "number") {
          return {
            label: `TP${i + 1}`,
            price: t,
          };
        }

        // object targets
        if (typeof t === "object") {
          return {
            label: t.label || `TP${i + 1}`,
            price: t.price,
          };
        }

        return null;
      })
      .filter(Boolean);

    return {
      ...fallbackPlan,

      entry_plan: clampArr(fallbackPlan.entry_plan),

      targets: normalizedTargets,

      symbol: fallbackPlan.symbol || decision?.symbol || "BTC",

      side: fallbackPlan.side || decision?.action || "observe",

      stop_loss: fallbackPlan.stop_loss || { price: null },
    };
  }, [tradePlan, decision]);

  const livePrice = useMemo(() => {
    return (
      num(decision?.live_price) ??
      num(decision?.last_price) ??
      num(decision?.market_price) ??
      null
    );
  }, [decision]);

  const symbol = (derived.symbol || "BTC").toUpperCase();

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <div className="text-sm text-gray-500">Trade plan laden…</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-6">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 font-bold text-lg">
          <Bot size={18} />
          Trade Plan
        </div>

        <div className="text-sm text-gray-500 mt-1">
          {symbol} · {(derived.side || "observe").toUpperCase()}
          {Number.isFinite(livePrice) && (
            <span className="ml-2 text-gray-400">
              • Live: €{fmtPrice(livePrice)}
            </span>
          )}
        </div>
      </div>

      {/* ENTRY */}
      <div className="rounded-xl border p-4 space-y-3">
        <SectionTitle icon={<TrendingUp size={16} />} title="Entry Plan" />

        {derived.entry_plan.length === 0 ? (
          <div className="text-sm text-gray-500">—</div>
        ) : (
          derived.entry_plan.map((e, i) => {
            const label =
              e.label ||
              (e.type === "limit"
                ? "Limit entry"
                : e.type === "market"
                ? "Market entry"
                : e.type === "watch"
                ? "Watch level"
                : "Entry");

            const isWatch = e.type === "watch";

            return (
              <div
                key={i}
                className={`flex justify-between p-3 rounded-lg ${
                  isWatch
                    ? "bg-blue-50 text-blue-700"
                    : "bg-gray-50 text-gray-800"
                }`}
              >
                <div className="font-medium">{label}</div>
                <div className="font-semibold">
                  €{fmtPrice(e.price)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* STOP LOSS */}
      <div className="rounded-xl border p-4">
        <SectionTitle icon={<Shield size={16} />} title="Stop Loss" />
        <div className="font-semibold">
          €{fmtPrice(derived.stop_loss?.price)}
        </div>
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
              <span className="font-semibold">
                €{fmtPrice(t.price)}
              </span>
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
