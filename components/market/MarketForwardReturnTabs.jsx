'use client';
import { useState } from 'react';

export default function MarketForwardReturnTabs({ data }) {
  const tabs = ['Week', 'Maand', 'Kwartaal', 'Jaar'];
  const [active, setActive] = useState('Week');

  const activeData = data[active.toLowerCase()] || [];

  return (
    <div className="border rounded p-4 bg-white dark:bg-gray-900">
      <div className="flex gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-4 py-1 rounded font-semibold border ${active === tab ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="p-2">Startdatum</th>
            <th className="p-2">Slotdatum</th>
            <th className="p-2">% Verandering</th>
            <th className="p-2">Gem. Dag rendement</th>
          </tr>
        </thead>
        <tbody>
          {activeData.map((row, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{row.start}</td>
              <td className="p-2">{row.end}</td>
              <td className={`p-2 ${row.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{row.change.toFixed(2)}%</td>
              <td className="p-2">{row.avgDaily.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
