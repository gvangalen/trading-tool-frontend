"use client";

import SkeletonTable from "@/components/ui/SkeletonTable";
import DayTable from "@/components/ui/DayTable";
import { AlertCircle, TrendingUp } from "lucide-react";

export default function TechnicalDayTableForDashboard({
  data = [],
  loading = false,
  error = "",
}) {

  // ⏳ LOADING (zonder card)
  if (loading) {
    return (
      <div>
        <SkeletonTable rows={5} columns={5} />
      </div>
    );
  }

  // ❌ ERROR (zonder card)
  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  // ⚠️ GEEN DATA (zonder card)
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-[var(--text-light)] flex items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4" />
        <span>Geen technische data beschikbaar.</span>
      </div>
    );
  }

  // ============================================
  // ✔️ DATA CONVERTEN NAAR DAYTABLE-FORMAAT
  // ============================================
  const formatted = data.map((item) => ({
    name: item.indicator || item.name || "–",
    value: item.value ?? item.waarde ?? "–",
    score: item.score ?? null,
    action: item.advice ?? item.advies ?? "–",
    interpretation: item.uitleg ?? item.explanation ?? "–",
  }));

  // ⭐️ TABEL — READ-ONLY MODE
  return (
    <DayTable
      title="Technische Analyse"
      icon={<TrendingUp className="w-5 h-5 text-[var(--primary)]" />}
      data={formatted}
      onRemove={null}   // 🚫 geen verwijderknop
    />
  );
}
