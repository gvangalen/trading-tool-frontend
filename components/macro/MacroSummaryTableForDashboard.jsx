"use client";

import { Globe2 } from "lucide-react";
import SkeletonTable from "@/components/ui/SkeletonTable";
import DayTable from "@/components/ui/DayTable";

export default function MacroSummaryTableForDashboard({
  data = [],
  loading = false,
  error = "",
}) {
  // ⏳ LOADING → alleen skeleton
  if (loading) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  // Log fout alleen in console, niet in UI
  if (error) {
    console.error("Macro data fout op dashboard:", error);
  }

  // Data altijd normaliseren
  const safeData = Array.isArray(data) ? data : [];

  // Eventueel mappen naar DayTable-formaat (nu vrij generiek)
  const formatted = safeData.map((item) => ({
    name: item.indicator || item.name || "–",
    value: item.value ?? item.waarde ?? "–",
    score: item.score ?? null,
    action: item.advice ?? item.advies ?? "–",
    interpretation: item.uitleg ?? item.interpretation ?? "–",
  }));

  // 👉 Altijd DayTable renderen
  // Bij 0 items toont DayTable zelf: "Nog geen data beschikbaar."
  return (
    <DayTable
      title="Macro Indicatoren"
      icon={<Globe2 className="w-5 h-5 text-[var(--primary)]" />}
      data={formatted}
      onRemove={null}
    />
  );
}
