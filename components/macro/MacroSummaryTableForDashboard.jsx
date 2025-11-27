'use client';

import CardWrapper from "@/components/ui/CardWrapper";
import SkeletonTable from "@/components/ui/SkeletonTable";
import DayTable from "@/components/ui/DayTable";  // ✅ DEZE gebruiken!
import { AlertCircle } from "lucide-react";

export default function MacroSummaryTableForDashboard({
  data = [],
  loading = false,
  error = "",
}) {
  // LOADING
  if (loading) {
    return (
      <CardWrapper>
        <SkeletonTable rows={5} columns={5} />
      </CardWrapper>
    );
  }

  // ERROR
  if (error) {
    return (
      <CardWrapper>
        <p className="text-red-500">{error}</p>
      </CardWrapper>
    );
  }

  // GEEN DATA
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <CardWrapper>
        <div className="p-4 text-center text-[var(--text-light)] flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Geen macrodata beschikbaar.</span>
        </div>
      </CardWrapper>
    );
  }

  // TABEL — via DayTable (read-only)
  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <span className="text-[var(--primary)]">🌍</span>
          <span>Macro Samenvatting</span>
        </div>
      }
    >
      {/* ⭐️ Gebruik DayTable met read-only mode */}
      <DayTable
        title={null} 
        icon={null}
        data={data}
        onRemove={null}   // ❗️GEEN DELETE KNOP
      />
    </CardWrapper>
  );
}
