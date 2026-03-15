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

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value == null) return [];

  // JSON string array
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through
    }

    // comma-separated fallback
    return trimmed
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [value];
};

const normalizeTargets = (value) => {
  const arr = toArray(value);

  return arr
    .map((item, i) => {
      // number target
      if (typeof item === "number") {
        return {
          label: `TP${i + 1}`,
          price: item,
        };
      }

      // string target
      if (typeof item === "string") {
        const parsed = num(item);
        if (parsed == null) return null;

        return {
          label: `TP${i + 1}`,
          price: parsed,
        };
      }

      // object target
      if (item && typeof item === "object") {
        const price =
          num(item.price) ??
          num(item.target) ??
          num(item.value) ??
          null;

        if (price == null) return null;

        return {
          label: item.label || item.name || `TP${i + 1}`,
          price,
        };
      }

      return null;
    })
    .filter(Boolean);
};

const normalizeEntryPlan = (value) => {
  const arr = toArray(value);

  return arr
    .map((item, i) => {
      // number entry
      if (typeof item === "number") {
        return {
          type: "watch",
          label: i === 0 ? "Watch level" : `Watch level ${i + 1}`,
          price: item,
        };
      }

      // string entry
      if (typeof item === "string") {
        const parsed = num(item);
        if (parsed == null) return null;

        return {
          type: "watch",
          label: i === 0 ? "Watch level" : `Watch level ${i + 1}`,
          price: parsed,
        };
      }

      // object entry
      if (item && typeof item === "object") {
        const price =
          num(item.price) ??
          num(item.entry) ??
          num(item.value) ??
          null;

        if (price == null) return null;

        return {
          type: item.type || "watch",
          label: item.label || item.name || "Entry",
          price,
        };
      }

      return null;
    })
    .filter(Boolean);
};

const normalizeStopLoss = (value) => {
  if (value == null) return { price: null };

  if (typeof value === "number") {
    return { price: value };
  }

  if (typeof value === "string") {
    const parsed = num(value);
    return { price: parsed };
  }

  if (typeof value === "object") {
    return {
      ...value,
      price:
        num(value.price) ??
        num(value.stop_loss) ??
        num(value.value) ??
        null,
    };
  }

  return { price: null };
};

const normalizeRisk = (value) => {
  if (!value || typeof value !== "object") {
    return { rr: null, risk_eur: null };
  }

  return {
    rr: value.rr ?? value.risk_reward ?? null,
    risk_eur: num(value.risk_eur) ?? null,
  };
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

    if (!fallbackPlan || typeof fallbackPlan !== "object") {
      return {
        symbol: decision?.symbol || "BTC",
        side: decision?.action || "observe",
        entry_plan: [],
        stop_loss: { price: null },
        targets: [],
        risk: { rr: null, risk_eur: null },
      };
    }

    return {
      symbol: fallbackPlan.symbol || decision?.symbol || "BTC",
      side: fallbackPlan.side || decision?.action || "observe",
      entry_plan: normalizeEntryPlan(fallbackPlan.entry_plan),
      stop_loss: normalizeStopLoss(fallbackPlan.stop_loss),
      targets: normalizeTargets(fallbackPlan.targets),
      risk: normalizeRisk(fallbackPlan.risk),
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
              e?.label ||
              (e?.type === "limit"
                ? "Limit entry"
                : e?.type === "market"
                ? "Market entry"
                : e?.type === "watch"
                ? "Watch level"
                : "Entry");

            const isWatch = e?.type === "watch";

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
                <div className="font-semibold">€{fmtPrice(e?.price)}</div>
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
              <span>{t?.label || `TP${i + 1}`}</span>
              <span className="font-semibold">€{fmtPrice(t?.price)}</span>
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
