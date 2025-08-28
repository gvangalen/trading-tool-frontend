'use client';

import { useState } from 'react';
import { formatChange, formatNumber } from '@/components/market/utils';

export default function MarketForwardReturnTabs({ data = {} }) {
  const tabs = ['Week', 'Maand', 'Kwartaal', 'Jaar'];
  const [active, setActive] = useState('Week');

  const activeKey = active.toLowerCase(); // "week", "maand", etc.
  const activeData = data[activeKey] || [];

  return (
    <div className="border rounded p-4 bg-white dark:bg-gray-900 shadow-sm">
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

      {/* 🔹 Table */}
      {activeData.length > 0 ? (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2">📅 Startdatum</th>
              <th className="p-2">📅 Slotdatum</th>
              <th className="p-2">📈 % Verandering</th>
              <th className="p-2">📊 Gem. dagrendement</th>
            </tr>
          </thead>
          <tbody>
            {activeData.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{row.start || '–'}</td>
                <td className="p-2">{row.end || '–'}</td>
                <td className="p-2 font-medium">{formatChange(row.change)}</td>
                <td className="p-2">{formatNumber(row.avgDaily)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-500 text-sm">
          ⚠️ Geen data beschikbaar voor <strong>{active}</strong>.
        </div>
      )}
    </div>
  );
}
