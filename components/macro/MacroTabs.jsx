"use client";

import { Globe } from "lucide-react";
import DayTable from "@/components/ui/DayTable";

export default function MacroTabs({
  activeTab,
  setActiveTab,
  macroData,
  loading,
  error,
  handleRemove,
}) {
  const tabs = ["Dag", "Week", "Maand", "Kwartaal"];

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
      <DayTable
        title={`Macro Analyse – ${activeTab}`}
        icon={<Globe className="w-5 h-5 text-[var(--primary)]" />}
        data={macroData}
        loading={loading}
        error={error}
        onRemove={handleRemove}   // ⬅️ Delete-knoppen werken nu
      />
    </div>
  );
}
