"use client";

import { AlertCircle, Globe2, Info } from "lucide-react";
import SkeletonTable from "@/components/ui/SkeletonTable";
import DayTable from "@/components/ui/DayTable"; // ✅ gebruikt de PRO-kaart + layout

export default function MacroSummaryTableForDashboard({
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
    return (
      <p className="text-red-500 text-sm">
        {error}
      </p>
    );
  }

  // ⚠️ GEEN DATA
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-[var(--text-light)] flex items-center justify-center gap-2 border border-[var(--card-border)] rounded-xl bg-white">
        <AlertCircle className="w-4 h-4" />
        <span>Geen macrodata beschikbaar.</span>
      </div>
    );
  }

  // ✅ TABEL VIA DayTable (volle PRO-kaart)
  return (
    <DayTable
      title="Macro Indicatoren"
      icon={<Globe2 className="w-5 h-5 text-[var(--primary)]" />}
      data={data}
      onRemove={null} // read-only in dashboard
    />
  );
}
