"use client";

import CardWrapper from "@/components/ui/CardWrapper";

// PRO tabellen
import DayTable from "@/components/ui/DayTable";
import WeekTable from "@/components/ui/WeekTable";
import MonthTable from "@/components/ui/MonthTable";
import QuarterTable from "@/components/ui/QuarterTable";

const TABS = ["Dag", "Week", "Maand", "Kwartaal"];

export default function TechnicalTabs({
  activeTab,
  setActiveTab,
  technicalData,
  handleRemove,
  loading,
  error,
}) {

  // Altijd data normaliseren
  const safeData = Array.isArray(technicalData) ? technicalData : [];

  const renderTable = () => {
    // ⏳ LOADING → geen error tonen, gewoon lege state via message
    if (loading) {
      return (
        <DayTable
          title="Technische Analyse"
          data={[]}   // Forceer lege tabel
          onRemove={null}
        />
      );
    }

    // ❌ Error → niet tonen aan gebruiker, wel loggen
    if (error) {
      console.error("❌ TechnicalTabs error:", error);
    }

    switch (activeTab) {
      case "Dag":
        return (
          <DayTable
            title="Technische Analyse"
            data={safeData}
            onRemove={handleRemove}
          />
        );

      case "Week":
        return (
          <WeekTable
            title="Technische Analyse"
            data={safeData}
          />
        );

      case "Maand":
        return (
          <MonthTable
            title="Technische Analyse"
            data={safeData}
          />
        );

      case "Kwartaal":
        return (
          <QuarterTable
            title="Technische Analyse"
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
      <div className="flex gap-3 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-150
              ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-[var(--text-dark)] border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 Tabel in kaart */}
      <CardWrapper>
        <div className="p-2">
          {renderTable()}
        </div>
      </CardWrapper>
    </>
  );
}
