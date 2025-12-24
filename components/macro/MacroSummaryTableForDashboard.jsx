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

  // ✅ Data komt AL genormaliseerd uit useMacroData
  const safeData = Array.isArray(data) ? data : [];

  const formatted = safeData.map((item) => ({
    name: item.name ?? "–",
    value: item.value ?? "–",
    score: item.score ?? null,
    action: item.action ?? "–",
    interpretation: item.interpretation ?? "–",
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
