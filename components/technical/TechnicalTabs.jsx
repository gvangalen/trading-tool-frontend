'use client';

import CardWrapper from "@/components/ui/CardWrapper";

// ✅ Correcte paden naar jouw nieuwe tabellen
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
  const renderTable = () => {
    if (loading) {
      return (
        <div className="p-4 text-center text-[var(--text-light)]">
          ⏳ Technische data laden...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center text-red-500">
          ❌ {error}
        </div>
      );
    }

    switch (activeTab) {
      case "Dag":
        return <DayTable data={technicalData} onRemove={handleRemove} />;
      case "Week":
        return <WeekTable data={technicalData} onRemove={handleRemove} />;
      case "Maand":
        return <MonthTable data={technicalData} onRemove={handleRemove} />;
      case "Kwartaal":
        return <QuarterTable data={technicalData} onRemove={handleRemove} />;
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

      {/* 🔹 Tabelcontainer */}
      <CardWrapper>
        <div className="p-2">{renderTable()}</div>
      </CardWrapper>
    </>
  );
}
