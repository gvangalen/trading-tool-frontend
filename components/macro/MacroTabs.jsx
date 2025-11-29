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
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="100%" className="p-4 text-center text-gray-500">
            ⏳ Laden...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="100%" className="p-4 text-center text-red-500">
            ❌ {error}
          </td>
        </tr>
      );
    }

    switch (activeTab) {
      case "Dag":
        // 👉 Alleen DAG krijgt delete-functie
        return <DayTable data={macroData} onRemove={handleRemove} />;

      case "Week":
        return <WeekTable data={macroData} />;

      case "Maand":
        return <MonthTable data={macroData} />;

      case "Kwartaal":
        return <QuarterTable data={macroData} />;

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

      <CardWrapper>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
      </CardWrapper>
    </>
  );
}
