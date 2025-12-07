"use client";

import SkeletonTable from "@/components/ui/SkeletonTable";
import DayTable from "@/components/ui/DayTable";
import { AlertCircle, TrendingUp } from "lucide-react";

export default function TechnicalDayTableForDashboard({
  data = [],
  loading = false,
  error = "",
}) {
  // ⏳ LOADING (zonder card, DayTable heeft eigen layout)
  if (loading) {
    return (
      <div>
        <SkeletonTable rows={5} columns={5} />
      </div>
    );
  }

  // ❌ ERROR (geen tabel tonen, alleen fout)
  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  // Zorg dat data altijd een array is
  const safeData = Array.isArray(data) ? data : [];

  // ============================================
  // ✔️ DATA CONVERTEN NAAR DAYTABLE-FORMAAT
  // ============================================
  const formatted = safeData.map((item) => ({
    name: item.indicator || item.name || "–",
    value: item.value ?? item.waarde ?? "–",
    score: item.score ?? null,
    action: item.advice ?? item.advies ?? "–",
    interpretation: item.uitleg ?? item.explanation ?? "–",
  }));

  // ⭐️ TABEL — READ-ONLY MODE
  return (
    <div className="space-y-2">
      <DayTable
        title="Technische Analyse"
        icon={<TrendingUp className="w-5 h-5 text-[var(--primary)]" />}
        data={formatted}
        onRemove={null} // 🚫 geen verwijderknop
      />

      {formatted.length === 0 && (
        <div className="p-2 text-center text-[var(--text-light)] text-xs flex items-center justify-center gap-2 italic">
          <AlertCircle className="w-4 h-4" />
          <span>Nog geen technische indicatoren toegevoegd.</span>
        </div>
      )}
    </div>
  );
}
