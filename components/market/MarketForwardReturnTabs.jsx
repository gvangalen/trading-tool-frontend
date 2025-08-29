'use client';

import { useState } from 'react';

// ✅ Hulpfunctie voor kleurcodering
const getCellStyle = (value) => {
  if (value === null || value === undefined) return 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500';
  return value >= 0 ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-white' : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-white';
};

// ✅ Formatter voor getallen
const formatPercentage = (value) => {
  if (value === null || value === undefined) return '–';
  return `${value.toFixed(2)}%`;
};

const tabs = ['Week', 'Maand', 'Kwartaal', 'Jaar'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function MarketForwardReturnTabs({ data = {} }) {
  const [active, setActive] = useState('Maand');

  const activeKey = active.toLowerCase(); // 'week', 'maand', etc.
  const activeData = data[activeKey] || [];

  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-900 shadow">
      {/* 🔹 Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-1 rounded font-semibold border transition-all duration-150
              ${active === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 Tabel */}
      {activeData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-2">✅</th>
                <th className="p-2">Jaar</th>
                {months.map((m) => (
                  <th key={m} className="p-2 text-xs">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeData
                .sort((a, b) => b.year - a.year)
                .map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2 text-center">
                      <input type="checkbox" className="form-checkbox" defaultChecked />
                    </td>
                    <td className="p-2 font-semibold">{row.year}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className={`p-2 text-center font-medium ${getCellStyle(val)}`}>
                        {formatPercentage(val)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          ⚠️ Geen data beschikbaar voor <strong>{active}</strong>.
        </div>
      )}
    </div>
  );
}
