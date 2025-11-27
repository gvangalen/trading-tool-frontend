"use client";

import { Globe } from "lucide-react";

import DayTable from "@/components/ui/DayTable";
import WeekTable from "@/components/ui/WeekTable";
import MonthTable from "@/components/ui/MonthTable";
import QuarterTable from "@/components/ui/QuarterTable";

export default function MacroTabs({
  activeTab,
  setActiveTab,
  macroData,
  loading,
  error,
  handleRemove,
}) {
  const tabs = ["Dag", "Week", "Maand", "Kwartaal"];

  /**
   * 🧩 Normaliseer grouped endpoints:
   * backend:  { label: "...", data: [...] }
   * frontend: { label: "...", items: [...] }
   */
  const normalizeGrouped = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((g) => ({
      label: g.label,
      items: g.data || g.items || [],
    }));
  };

  const renderTable = () => {
    if (loading)
      return <p className="text-gray-500 italic">Laden…</p>;

    if (error)
      return <p className="text-red-500">{error}</p>;

    switch (activeTab) {
      case "Dag":
        return (
          <DayTable
            title="Dagelijkse Macro Analyse"
            icon={<Globe className="w-5 h-5 text-[var(--primary)]" />}
            data={macroData}
            onRemove={handleRemove}
          />
        );

      case "Week":
        return (
          <WeekTable
            data={normalizeGrouped(macroData)}
            onRemove={handleRemove}
          />
        );

      case "Maand":
        return (
          <MonthTable
            data={normalizeGrouped(macroData)}
            onRemove={handleRemove}
          />
        );

      case "Kwartaal":
        return (
          <QuarterTable
            data={normalizeGrouped(macroData)}
            onRemove={handleRemove}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* TABS */}
      <div className="flex gap-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`
              px-5 py-2 rounded-lg border transition-all
              ${
                activeTab === t
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-[var(--text-dark)] border-[var(--sidebar-border)] hover:bg-[var(--bg-soft)]"
              }
            `}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TABEL */}
      {renderTable()}
    </div>
  );
}
