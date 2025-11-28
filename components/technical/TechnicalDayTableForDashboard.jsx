"use client";

import { AlertCircle, Info, TrendingUp } from "lucide-react";
import DayTable from "@/components/ui/DayTable";  // ⭐ Nieuwe PRO-tabel
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function TechnicalDayTableForDashboard({
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
      <div className="
        p-4 text-center text-[var(--text-light)]
        flex items-center justify-center gap-2
        border border-[var(--card-border)]
        rounded-xl bg-white
      ">
        <AlertCircle className="w-4 h-4" />
        Geen technische data beschikbaar.
      </div>
    );
  }

  // ===============================================
  //  ✔️ DATA MAPPEN NAAR DAYTABLE FORMaat
  // ===============================================
  const formatted = data.map((item) => ({
    name: item.indicator || item.name || "–",
    value: item.value ?? item.waarde ?? "–",
    score: item.score ?? null,
    action: item.advice ?? item.advies ?? "–",
    interpretation: item.uitleg ?? item.explanation ?? "–",
  }));

  // ⭐ Gebruik DayTable (PRO-stijl)
  return (
    <DayTable
      title="Technische Analyse"
      icon={<TrendingUp className="w-5 h-5 text-[var(--primary)]" />}
      data={formatted}
      onRemove={null} // dashboard = read-only
    />
  );
}
