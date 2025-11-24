"use client";

import { useState } from "react";
import { useMacroData } from "@/hooks/useMacroData";

// Nieuwe Universele Table
import DayTable from "@/components/ui/DayTable";

// UI
import CardWrapper from "@/components/ui/CardWrapper";

const TABS = ["Dag", "Week", "Maand", "Kwartaal"];

export default function MacroTabs() {
  const [activeTab, setActiveTab] = useState("Dag");

  const {
    macroData,
    removeMacroIndicator,
    getExplanation,
    loading,
    error,
  } = useMacroData(activeTab);

  return (
    <>
      {/* ---------------------------------------------------- */}
      {/* TABS */}
      {/* ---------------------------------------------------- */}
      <div className="flex space-x-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 rounded font-semibold border transition-all
              ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* CONTENT WRAPPER */}
      {/* ---------------------------------------------------- */}
      <CardWrapper>
        {loading && (
          <p className="text-center py-6 text-[var(--text-light)]">⏳ Laden…</p>
        )}

        {error && (
          <p className="text-center py-6 text-red-500 font-medium">
            ❌ {error}
          </p>
        )}

        {!loading && !error && (
          <DayTable
            title={`Macro Analyse – ${activeTab}`}
            icon={null}
            data={macroData}
            onRemove={removeMacroIndicator}
          />
        )}
      </CardWrapper>
    </>
  );
}
