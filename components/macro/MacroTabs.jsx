"use client";

import CardWrapper from "@/components/ui/CardWrapper";

// PRO Tables
import DayTable from "@/components/ui/DayTable";
import WeekTable from "@/components/ui/WeekTable";
import MonthTable from "@/components/ui/MonthTable";
import QuarterTable from "@/components/ui/QuarterTable";

const TABS = ["Dag", "Week", "Maand", "Kwartaal"];

export default function MacroTabs({
  activeTab,
  setActiveTab,
  macroData,
  loading,
  error,
  handleRemove,
}) {
  // Always normalize data
  const safeData = Array.isArray(macroData) ? macroData : [];

  // Choose table component based on tab
  const renderTable = () => {
    // ⏳ LOADING → alleen skeleton/empty state in een tabel
    if (loading) {
      return (
        <DayTable
          title="Macro Indicatoren"
          data={[]}   // force empty UI
          onRemove={null}
        />
      );
    }

    // Log error but do NOT show to user
    if (error) {
      console.error("MacroTabs error:", error);
    }

    switch (activeTab) {
      case "Dag":
        return (
          <DayTable
            title="Macro Indicatoren"
            data={safeData}
            onRemove={handleRemove} // Alleen Dag-tab ondersteunt verwijderen
          />
        );

      case "Week":
        return (
          <WeekTable
            title="Macro Indicatoren"
            data={safeData}
          />
        );

      case "Maand":
        return (
          <MonthTable
            title="Macro Indicatoren"
            data={safeData}
          />
        );

      case "Kwartaal":
        return (
          <QuarterTable
            title="Macro Indicatoren"
            data={safeData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* 🔹 Tabs */}
      <div className="flex space-x-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-semibold border transition ${
              activeTab === tab
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 PRO Card Wrapper */}
      <CardWrapper>
        {renderTable()}
      </CardWrapper>
    </>
  );
}
