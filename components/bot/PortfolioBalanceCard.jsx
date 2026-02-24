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

const RANGES = [
  { key: "1D", label: "1D" },
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "1Y", label: "1Y" },
  { key: "ALL", label: "ALL" },
];

const fmtEur = (n) =>
  new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtPct = (n) =>
  `${(n || 0).toFixed(1)}%`;

function calcDelta(series) {
  if (!Array.isArray(series) || series.length < 2) {
    return { last: 0, deltaEur: 0, deltaPct: 0 };
  }
  const first = Number(series[0]?.value_eur ?? 0);
  const last = Number(series[series.length - 1]?.value_eur ?? 0);
  const deltaEur = last - first;
  const deltaPct = first > 0 ? (deltaEur / first) * 100 : 0;
  return { last, deltaEur, deltaPct };
}

function shortDate(ts, rangeKey) {
  const d = new Date(ts);
  // 1D -> tijd, anders datum
  if (rangeKey === "1D") {
    return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("nl-NL", { day: "2-digit", month: "short" });
}

export default function PortfolioBalanceCard({
  dataByRange = {},     // { "1W": PortfolioPoint[], ... }
  defaultRange = "1W",
  title = "Portfolio balance",
  currencyLabel = "EUR",
}) {
  const [range, setRange] = useState(defaultRange);

  const series = dataByRange?.[range] || [];
  const { last, deltaEur, deltaPct } = useMemo(() => calcDelta(series), [series]);

  const isDown = deltaEur < 0;

  const chartData = useMemo(() => {
    return (series || []).map((p) => ({
      ts: p.ts,
      value_eur: Number(p.value_eur ?? 0),
      label: shortDate(p.ts, range),
    }));
  }, [series, range]);

  return (
    <div className="card-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-[var(--text-dark)]">
            {title}
          </div>

          <div className="text-4xl font-semibold text-[var(--text-dark)] tracking-tight">
            {fmtEur(last)}
          </div>

          <div
            className={`text-sm font-semibold ${
              isDown ? "text-[var(--score-sell)]" : "text-[var(--score-strong-buy)]"
            }`}
          >
            {isDown ? "↘" : "↗"} {fmtPct(deltaPct)} ({fmtEur(deltaEur)})
          </div>
        </div>

        {/* Range pills */}
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`px-3 py-1 rounded-[var(--radius-sm)] text-xs font-semibold border transition ${
                range === r.key
                  ? "bg-[var(--primary)] text-white border-transparent"
                  : "bg-[var(--surface-2)] text-[var(--text-dark)] border-[var(--border)]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-[240px]">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
              <defs>
                {/* theme-driven gradient */}
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.30} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.00} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={45}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              />

              <Tooltip
                contentStyle={{
                  background: "var(--surface-1)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-md)",
                  color: "var(--text-dark)",
                }}
                labelStyle={{ color: "var(--text-light)" }}
                formatter={(v) => [fmtEur(Number(v)), currencyLabel]}
                labelFormatter={(l) => l}
              />

              <Area
                type="monotone"
                dataKey="value_eur"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#balanceFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-[var(--text-light)]">
            Geen data beschikbaar
          </div>
        )}
      </div>
    </div>
  );
}
