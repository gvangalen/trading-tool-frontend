'use client';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import { useState } from 'react';

export default function TechnicalPage() {
  const { technicalData, avgScore, advies, removeIndicator, loading, error } = useTechnicalData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = technicalData.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">📉 Technical Analysis</h2>

      {/* Bedieningsopties */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search asset..."
          className="border p-2 rounded w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status */}
      {loading && <p className="text-gray-600">⏳ Loading data...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {/* Technische Analyse Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Asset</th>
              <th className="p-2">RSI</th>
              <th className="p-2">Volume</th>
              <th className="p-2">200MA</th>
              <th className="p-2">Score</th>
              <th className="p-2">Trend</th>
              <th className="p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.symbol} className="border-t">
                <td className="p-2">{item.symbol}</td>
                <td className="p-2">{item.rsi ?? '-'}</td>
                <td className="p-2">{item.volume ? Number(item.volume).toLocaleString() : '-'}</td>
                <td className="p-2">{item.ma_200 ?? '-'}</td>
                <td className="p-2 font-bold">{item.score ?? '-'}</td>
                <td className="p-2">{item.trend ?? '-'}</td>
                <td className="p-2">
                  <button
                    onClick={() => removeIndicator(item.symbol)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ❌ Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Samenvatting */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">📊 Total Technical Score: <span className="text-green-600">{avgScore}</span></h3>
        <h3 className="text-lg font-semibold">📈 Advice: <span className="text-blue-600">{advies}</span></h3>
      </div>
    </div>
  );
}
