"use client";

import { AlertCircle, Globe2 } from "lucide-react";
import SkeletonTable from "@/components/ui/SkeletonTable";
import DayTable from "@/components/ui/DayTable";

export default function MacroSummaryTableForDashboard({
  data = [],
  loading = false,
  error = "",
}) {
  // ⏳ LOADING (altijd zonder card)
  if (loading) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  // ❌ ERROR
  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  // Zorg dat data altijd een array is
  const safeData = Array.isArray(data) ? data : [];

  // ⭐ DayTable ontvangt de data direct (macro heeft al juiste vorm)
  return (
    <div className="space-y-2">
      <DayTable
        title="Macro Indicatoren"
        icon={<Globe2 className="w-5 h-5 text-[var(--primary)]" />}
        data={safeData}
        onRemove={null} // ➝ Geen verwijderknoppen in dashboard
      />

      {/* ⚠️ Lege tabel melding */}
      {safeData.length === 0 && (
        <div className="p-2 text-center text-[var(--text-light)] text-xs flex items-center justify-center gap-2 italic">
          <AlertCircle className="w-4 h-4" />
          <span>Nog geen macro-indicatoren toegevoegd.</span>
        </div>
      )}
    </div>
  );
}
