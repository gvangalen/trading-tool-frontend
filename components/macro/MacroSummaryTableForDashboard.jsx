"use client";

import { Globe2 } from "lucide-react";
import SkeletonTable from "@/components/ui/SkeletonTable";
import DayTable from "@/components/ui/DayTable";

export default function MacroSummaryTableForDashboard({
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
    console.error("Macro data fout op dashboard:", error);
  }

  // ✅ Data defensief maken
  const safeData = Array.isArray(data) ? data : [];

  // 🔥 DEFINITIEVE NORMALISATIE (BELANGRIJK)
  const formatted = safeData.map((item) => ({
    indicator: item.indicator || item.name || "–", // ✅ DIT WAS DE FIX
    value: item.value ?? null,
    score: item.score ?? null,
    action: item.action ?? "–",
    interpretation: item.interpretation ?? "–",
    timestamp: item.timestamp,
  }));

  return (
    <DayTable
      title="Macro Indicatoren"
      icon={<Globe2 className="w-5 h-5 text-[var(--primary)]" />}
      data={formatted}
      onRemove={null} // dashboard = read-only
    />
  );
}
