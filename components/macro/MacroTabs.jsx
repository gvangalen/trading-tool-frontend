"use client";

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

      {/* ------------------------- */}
      {/* TAB BUTTONS */}
      {/* ------------------------- */}
      <div className="flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-5 py-2 rounded-xl text-sm font-medium
              border transition-all
              ${
                activeTab === tab
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-[var(--text-dark)] border-[var(--card-border)] hover:bg-[var(--sidebar-hover)]"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ------------------------- */}
      {/* CONTENT / TABLE */}
      {/* ------------------------- */}
      <div>
        {loading && (
          <p className="text-sm text-[var(--text-light)]">Bezig met laden…</p>
        )}

        {error && (
          <p className="text-sm text-red-500">Fout: {error}</p>
        )}

        {!loading && !error && (
          <DayTable
            title={`Macro Analyse – ${activeTab}`}
            icon={null}
            data={macroData}
            onRemove={handleRemove}
          />
        )}
      </div>
    </div>
  );
}
