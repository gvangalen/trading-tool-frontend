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

  // ❌ Error alleen loggen
  if (error) {
    console.error("Technische data fout op dashboard:", error);
  }

  // ✅ data komt AL genormaliseerd uit useTechnicalData
  const safeData = Array.isArray(data) ? data : [];

  const formatted = safeData.map((item) => ({
    name: item.name ?? "–",
    value: item.value ?? null,
    score: item.score ?? null,
    action: item.action ?? "–",
    interpretation: item.interpretation ?? "–",

    // 🔥 DIT WAS DE FIX
    timestamp: item.timestamp ?? null,
  }));

  return (
    <DayTable
      title="Technische Analyse"
      icon={<TrendingUp className="w-5 h-5 text-[var(--primary)]" />}
      data={formatted}
      onRemove={null} // dashboard = read-only
    />
  );
}
