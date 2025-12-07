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

  // ❌ ERROR
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // Data altijd normaliseren
  const safeData = Array.isArray(data) ? data : [];

  const formatted = safeData.map((item) => ({
    name: item.indicator || item.name || "–",
    value: item.value ?? item.waarde ?? "–",
    score: item.score ?? null,
    action: item.advice ?? item.advies ?? "–",
    interpretation: item.uitleg ?? item.explanation ?? "–",
  }));

  // 👉 ALTIJD DayTable renderen — ook wanneer formatted.length === 0
  return (
    <DayTable
      title="Technische Analyse"
      icon={<TrendingUp className="w-5 h-5 text-[var(--primary)]" />}
      data={formatted}
      onRemove={null}
    />
  );
}
