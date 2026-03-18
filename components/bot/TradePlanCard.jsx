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

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    return trimmed
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [value];
};

/* =========================
   NORMALIZERS
========================= */

const normalizeTargets = (value) =>
  toArray(value)
    .map((item, i) => {
      if (typeof item === "number") {
        return { label: `TP${i + 1}`, price: item };
      }

      if (typeof item === "string") {
        const parsed = num(item);
        if (parsed == null) return null;
        return { label: `TP${i + 1}`, price: parsed };
      }

      if (item && typeof item === "object") {
        const price =
          num(item.price) ??
          num(item.target) ??
          num(item.value);

        if (price == null) return null;

        return {
          label: item.label || item.name || `TP${i + 1}`,
          price,
        };
      }

      return null;
    })
    .filter(Boolean);

const normalizeEntryPlan = (value) =>
  toArray(value)
    .map((item, i) => {
      if (typeof item === "number") {
        return {
          type: "watch",
          label: `Watch level ${i + 1}`,
          price: item,
        };
      }

      if (typeof item === "string") {
        const parsed = num(item);
        if (parsed == null) return null;

        return {
          type: "watch",
          label: `Watch level ${i + 1}`,
          price: parsed,
        };
      }

      if (item && typeof item === "object") {
        const price =
          num(item.price) ??
          num(item.entry) ??
          num(item.value);

        if (price == null) return null;

        return {
          type: item.type || "watch",
          label: item.label || item.name || `Entry ${i + 1}`,
          price,
        };
      }

      return null;
    })
    .filter(Boolean);

const normalizeStopLoss = (value) => {
  const price =
    typeof value === "object"
      ? num(value.price) ?? num(value.stop_loss) ?? num(value.value)
      : num(value);

  return { price };
};

const normalizeRisk = (value) => {
  if (!value || typeof value !== "object") {
    return { rr: null, risk_eur: null };
  }

  return {
    rr: value.rr ?? value.risk_reward ?? null,
    risk_eur: num(value.risk_eur),
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
   MAIN COMPONENT
========================= */

export default function TradePlanCard({
  tradePlan = null,
  decision = null,
  loading = false,
}) {
  const safeDecision = decision || {};

  /* ================= DERIVE PLAN ================= */

  const derived = useMemo(() => {
    const raw =
      tradePlan ||
      safeDecision?.trade_plan ||
      safeDecision?.plan ||
      null;

    if (!raw || typeof raw !== "object") {
      return {
        symbol: safeDecision?.symbol || "BTC",
        side: safeDecision?.action || "observe",
        entry_plan: [],
        stop_loss: { price: null },
        targets: [],
        risk: { rr: null, risk_eur: null },
      };
    }

    return {
      symbol: raw.symbol || safeDecision?.symbol || "BTC",
      side: raw.side || safeDecision?.action || "observe",
      entry_plan: normalizeEntryPlan(raw.entry_plan),
      stop_loss: normalizeStopLoss(raw.stop_loss),
      targets: normalizeTargets(raw.targets),
      risk: normalizeRisk(raw.risk),
    };
  }, [tradePlan, safeDecision]);

  /* ================= LIVE PRICE ================= */

  const livePrice = useMemo(() => {
    return (
      num(safeDecision?.live_price) ??
      num(safeDecision?.price) ??
      num(safeDecision?.market_price) ??
      null
    );
  }, [safeDecision]);

  const symbol = (derived.symbol || "BTC").toUpperCase();

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <div className="text-sm text-gray-500">
          Trade plan laden…
        </div>
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
          derived.entry_plan.map((e, i) => (
            <div
              key={i}
              className={`flex justify-between p-3 rounded-lg ${
                e.type === "watch"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              <div className="font-medium">
                {e.label}
              </div>

              <div className="font-semibold">
                €{fmtPrice(e.price)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* STOP LOSS */}
      <div className="rounded-xl border p-4">
        <SectionTitle icon={<Shield size={16} />} title="Stop Loss" />

        <div className="font-semibold">
          €{fmtPrice(derived.stop_loss.price)}
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
          Risk: {fmtEur(derived.risk.risk_eur)}
        </div>

        <div className="text-sm text-gray-600">
          R:R: {derived.risk.rr ?? "—"}
        </div>
      </div>
    </div>
  );
}
