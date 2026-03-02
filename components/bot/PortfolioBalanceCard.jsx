"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import usePortfolioBalance from "@/hooks/usePortfolioBalance";

/* =====================================================
   RANGE CONFIG
===================================================== */
const RANGES = [
  { key: "1D", label: "1D", bucket: "1h", limit: 24 },
  { key: "1W", label: "1W", bucket: "1h", limit: 24 * 7 },
  { key: "1M", label: "1M", bucket: "1d", limit: 30 },
  { key: "1Y", label: "1Y", bucket: "1d", limit: 365 },
  { key: "ALL", label: "ALL", bucket: "1d", limit: 2000 },
];

/* =====================================================
   6 PROFESSIONAL METRICS
===================================================== */
const MODES = [
  { key: "equity", label: "Equity" },
  { key: "cash", label: "Cash" },
  { key: "btc_value", label: "BTC Value" },
  { key: "btc_qty", label: "BTC Qty" },
  { key: "invested", label: "Invested" },
  { key: "unrealized_pnl", label: "Unrealized PnL" },
];

/* =====================================================
   FORMATTERS
===================================================== */
const fmtEur = (n) =>
  new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const fmtBtc = (n) => `${Number(n || 0).toFixed(4)} BTC`;

const fmtPct = (n) => `${Number(n || 0).toFixed(1)}%`;

function shortDate(ts, rangeKey) {
  const d = new Date(ts);
  if (rangeKey === "1D") {
    return d.toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "short",
  });
}

/* =====================================================
   GENERIC DELTA CALC
===================================================== */
function calcDelta(series, mode) {
  if (!Array.isArray(series) || series.length < 2) {
    return { last: 0, delta: 0, pct: 0 };
  }

  const first = Number(series[0]?.[mode] ?? 0);
  const last = Number(series[series.length - 1]?.[mode] ?? 0);

  const delta = last - first;
  const pct = first !== 0 ? (delta / first) * 100 : 0;

  return { last, delta, pct };
}

export default function PortfolioBalanceCard({
  defaultRange = "1W",
  title = "Portfolio balance",
}) {
  const [range, setRange] = useState(defaultRange);
  const [mode, setMode] = useState("equity");

  const rangeConfig = RANGES.find((r) => r.key === range) || RANGES[1];

  const { data, loading } = usePortfolioBalance({
    bucket: rangeConfig.bucket,
    limit: rangeConfig.limit,
  });

  /* =====================================================
     SERIES (fallback safe)
  ===================================================== */
  const series = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) return data;

    const now = new Date();
    const points = [];

    for (let i = rangeConfig.limit - 1; i >= 0; i--) {
      const d = new Date(now);

      if (rangeConfig.bucket === "1h") {
        d.setHours(now.getHours() - i);
      } else {
        d.setDate(now.getDate() - i);
      }

      points.push({
        ts: d.toISOString(),
        equity: 0,
        cash: 0,
        btc_value: 0,
        btc_qty: 0,
        invested: 0,
        unrealized_pnl: 0,
      });
    }

    return points;
  }, [data, rangeConfig.bucket, rangeConfig.limit]);

  const { last, delta, pct } = useMemo(
    () => calcDelta(series, mode),
    [series, mode]
  );

  const isDown = delta < 0;

  /* =====================================================
     CHART DATA
  ===================================================== */
  const chartData = useMemo(() => {
    return series.map((p) => ({
      ts: p.ts,
      value: Number(p?.[mode] ?? 0),
      label: shortDate(p.ts, range),
    }));
  }, [series, range, mode]);

  /* =====================================================
     Y DOMAIN AUTO-SAFE
  ===================================================== */
  const yDomain = useMemo(() => {
    if (!chartData.length) return ["auto", "auto"];

    const values = chartData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) {
      const padding = min === 0 ? 100 : Math.max(Math.abs(min) * 0.05, 1);
      return [min - padding, max + padding];
    }

    const span = max - min;
    const padding = span * 0.1;

    return [min - padding, max + padding];
  }, [chartData]);

  /* =====================================================
     VALUE FORMAT MODE-AWARE
  ===================================================== */
  const formatValue = (v) => {
    if (mode === "btc_qty") return fmtBtc(v);
    return fmtEur(v);
  };

  const yTickFormatter = (v) => {
    const n = Number(v || 0);

    if (mode === "btc_qty") return n.toFixed(2);

    if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;

    return `${Math.round(n)}`;
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="card-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-[var(--text-dark)]">
            {title}
          </div>

          <div className="text-4xl font-semibold tracking-tight text-[var(--text-dark)]">
            {formatValue(last)}
          </div>

          <div
            className={`text-sm font-semibold ${
              isDown
                ? "text-[var(--score-sell)]"
                : "text-[var(--score-strong-buy)]"
            }`}
          >
            {isDown ? "↘" : "↗"} {fmtPct(pct)} ({formatValue(delta)})
          </div>
        </div>

        {/* RANGE + MODE */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap justify-end">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                className={`px-3 py-1 rounded text-xs font-semibold border transition ${
                  range === r.key
                    ? "bg-[var(--primary)] text-white border-transparent"
                    : "bg-[var(--surface-2)] text-[var(--text-dark)] border-[var(--border)]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap justify-end">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={`px-3 py-1 rounded text-xs font-semibold border transition ${
                  mode === m.key
                    ? "bg-indigo-600 text-white border-transparent"
                    : "bg-[var(--surface-2)] text-[var(--text-dark)] border-[var(--border)]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 h-[240px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-sm text-[var(--text-light)]">
            Laden...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="label" axisLine={false} tickLine={false} />

              <YAxis
                domain={yDomain}
                axisLine={false}
                tickLine={false}
                width={60}
                tickFormatter={yTickFormatter}
              />

              <Tooltip
                formatter={(v) => formatValue(v)}
                contentStyle={{
                  background: "var(--surface-1)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-md)",
                  color: "var(--text-dark)",
                }}
                labelStyle={{ color: "var(--text-light)" }}
                labelFormatter={(l) => l}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#balanceFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
