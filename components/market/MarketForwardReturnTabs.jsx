'use client';

import { useState } from 'react';

const tabs = ['Week', 'Maand', 'Kwartaal', 'Jaar'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const getCellStyle = (value) => {
  if (value === null || value === undefined) return 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500';
  return value >= 0 ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-white' : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-white';
};

const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '–';
  return `${value.toFixed(1)}%`;
};

export default function MarketForwardReturnTabs({ data = {} }) {
  const [active, setActive] = useState('Maand');
  const [selectedYears, setSelectedYears] = useState(() =>
    (data['maand'] || []).map((row) => row.year)
  );

  const activeKey = active.toLowerCase();
  const activeData = data[activeKey] || [];

  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const calculateYearAvg = (values) => {
    const valid = values.filter((v) => v !== null && v !== undefined);
    const sum = valid.reduce((a, b) => a + b, 0);
    return valid.length ? sum / valid.length : null;
  };

  const calculateMonthAvgs = () => {
    const totals = new Array(12).fill(0);
    const counts = new Array(12).fill(0);

    activeData.forEach((row) => {
      row.values.forEach((val, idx) => {
        if (val !== null && val !== undefined) {
          totals[idx] += val;
          counts[idx] += 1;
        }
      });
    });

    return totals.map((total, i) => (counts[i] ? total / counts[i] : null));
  };

  const monthAverages = calculateMonthAvgs();

  const selectedData = activeData.filter((row) => selectedYears.includes(row.year));

  const forwardStats = months.map((_, monthIdx) => {
    const values = selectedData.map((row) => row.values[monthIdx]);
    const valid = values.filter((v) => v !== null && v !== undefined);
    const wins = valid.filter((v) => v > 0).length;
    const losses = valid.filter((v) => v <= 0).length;
    const total = valid.length;
    const returnRate = total ? (wins / total) * 100 : null;

    return { total, wins, losses, returnRate };
  });

  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-900 shadow">
      {/* Tabs */}
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

      {/* Table */}
      {activeData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border mb-6">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-2 text-left">✅</th>
                <th className="p-2 text-left">Jaar</th>
                {months.map((m) => (
                  <th key={m} className="p-2 text-xs text-center">{m}</th>
                ))}
                <th className="p-2 text-center font-semibold">Gem.</th>
              </tr>
            </thead>
            <tbody>
              {activeData
                .sort((a, b) => b.year - a.year)
                .map((row, idx) => {
                  const avg = calculateYearAvg(row.values);
                  return (
                    <tr key={idx} className="border-t">
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={selectedYears.includes(row.year)}
                          onChange={() => toggleYear(row.year)}
                        />
                      </td>
                      <td className="p-2 font-semibold">{row.year}</td>
                      {row.values.map((val, i) => (
                        <td key={i} className={`p-2 text-center font-medium ${getCellStyle(val)}`}>
                          {formatPercentage(val)}
                        </td>
                      ))}
                      <td className="p-2 text-center font-semibold">
                        {formatPercentage(avg)}
                      </td>
                    </tr>
                  );
                })}

              {/* Onderste rij met maandgemiddelden */}
              <tr className="border-t bg-gray-50 dark:bg-gray-800">
                <td className="p-2 text-center">–</td>
                <td className="p-2 font-semibold">Gemiddelde</td>
                {monthAverages.map((val, i) => (
                  <td key={i} className={`p-2 text-center font-semibold ${getCellStyle(val)}`}>
                    {formatPercentage(val)}
                  </td>
                ))}
                <td className="p-2 text-center font-semibold">–</td>
              </tr>
            </tbody>
          </table>

          {/* Forward Return Stats Table */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold mb-2">Forward Return Results (alleen geselecteerde jaren)</h3>
            <table className="w-full text-sm border">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <tr>
                  <th className="p-2 text-left">Stat</th>
                  {months.map((m) => (
                    <th key={m} className="p-2 text-xs text-center">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-semibold">Totals</td>
                  {forwardStats.map((s, i) => (
                    <td key={i} className="p-2 text-center">{s.total}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Wins</td>
                  {forwardStats.map((s, i) => (
                    <td key={i} className="p-2 text-center text-green-700 dark:text-green-400">{s.wins}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Losses</td>
                  {forwardStats.map((s, i) => (
                    <td key={i} className="p-2 text-center text-red-700 dark:text-red-400">{s.losses}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Returns</td>
                  {forwardStats.map((s, i) => (
                    <td key={i} className="p-2 text-center font-semibold">
                      {s.returnRate !== null ? `${s.returnRate.toFixed(1)}%` : '–'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          ⚠️ Geen data beschikbaar voor <strong>{active}</strong>.
        </div>
      )}
    </div>
  );
}
