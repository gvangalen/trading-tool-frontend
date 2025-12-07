"use client";

import SkeletonTable from "@/components/ui/SkeletonTable";
import DayTable from "@/components/ui/DayTable";
import { TrendingUp } from "lucide-react";

export default function TechnicalDayTableForDashboard({
  data = [],
  loading = false,
  error = "",
}) {
  // ⏳ LOADING
  if (loading) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  // Data normaliseren
  const safeData = Array.isArray(data) ? data : [];

  const formatted = safeData.map((item) => ({
    name: item.indicator || item.name || "–",
    value: item.value ?? item.waarde ?? "–",
    score: item.score ?? null,
    action: item.advice ?? item.advies ?? "–",
    interpretation: item.uitleg ?? item.explanation ?? "–",
  }));

  return (
    <div className="space-y-2">

      {/* ❌-error: tonen maar NIET returnen */}
      {error && (
        <div className="text-red-500 px-2 text-sm">{error}</div>
      )}

      {/* ✔ ALTIJD tabel tonen */}
      <DayTable
        title="Technische Analyse"
        icon={<TrendingUp className="w-5 h-5 text-[var(--primary)]" />}
        data={formatted}
        onRemove={null}
      />
    </div>
  );
}
