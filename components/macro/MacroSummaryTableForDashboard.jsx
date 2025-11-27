'use client';

import SkeletonTable from "@/components/ui/SkeletonTable";
import DayTable from "@/components/ui/DayTable";
import { AlertCircle } from "lucide-react";

export default function MacroSummaryTableForDashboard({
  data = [],
  loading = false,
  error = "",
}) {

  // LOADING (zonder card)
  if (loading) {
    return (
      <div>
        <SkeletonTable rows={5} columns={5} />
      </div>
    );
  }

  // ERROR (zonder card)
  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  // GEEN DATA (zonder card)
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-[var(--text-light)] flex items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4" />
        <span>Geen macrodata beschikbaar.</span>
      </div>
    );
  }

  // ⭐️ TABEL – pure DayTable (READ-ONLY, dus geen verwijderen)
  return (
    <DayTable
      title="Macro Samenvatting"
      icon={<span className="text-[var(--primary)]">🌍</span>}
      data={data}
      onRemove={null}   // ❗️ GEEN delete knop tonen
    />
  );
}
