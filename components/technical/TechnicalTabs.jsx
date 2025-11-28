"use client";

import CardWrapper from "@/components/ui/CardWrapper";

import TechnicalDayTable from "./TechnicalDayTable";
import TechnicalWeekTable from "./TechnicalWeekTable";
import TechnicalMonthTable from "./TechnicalMonthTable";
import TechnicalQuarterTable from "./TechnicalQuarterTable";

const TABS = ["Dag", "Week", "Maand", "Kwartaal"];

export default function TechnicalTabs({
  activeTab,
  setActiveTab,
  technicalData = [],
  handleRemove,
  loading,
  error,
}) {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-4 text-center text-[var(--text-light)]">
          ⏳ Laden...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center text-red-500 font-medium">
          ❌ {error}
        </div>
      );
    }

    switch (activeTab) {
      case "Dag":
        return (
          <TechnicalDayTable data={technicalData} onRemove={handleRemove} />
        );

      case "Week":
        return (
          <TechnicalWeekTable data={technicalData} onRemove={handleRemove} />
        );

      case "Maand":
        return (
          <TechnicalMonthTable data={technicalData} onRemove={handleRemove} />
        );

      case "Kwartaal":
        return (
          <TechnicalQuarterTable data={technicalData} onRemove={handleRemove} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* TABS — PRO Style */}
      <div className="flex space-x-3 mb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 rounded-lg font-semibold border transition-all
                ${
                  isActive
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                    : "bg-[var(--bg-soft)] border-[var(--card-border)] text-[var(--text-dark)] hover:bg-[var(--bg-soft-hover)]"
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* TABLE — PRO Style Wrapper */}
      <CardWrapper>
        <div className="w-full">
          {renderContent()}
        </div>
      </CardWrapper>
    </div>
  );
}
