"use client";

import React from "react";

const TABS = ["Dag", "Week", "Maand", "Kwartaal"];

export default function MacroTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-4 mb-6">
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
  );
}
