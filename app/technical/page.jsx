'use client';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import { useState } from 'react';

export default function TechnicalPage() {
  const { technicalData, avgScore, advies, removeIndicator, loading, error } = useTechnicalData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = technicalData.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function scoreColor(score) {
    if (score >= 75) return 'text-green-600 font-bold';
    if (score >= 50) return 'text-yellow-500 font-semibold';
    if (score >= 25) return 'text-orange-500';
    return 'text-red-500';
  }

  function trendEmoji(trend) {
    switch (trend) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      case 'neutral': return '⚖️';
      default: return '–';
    }
  }

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
      {!loading && filteredData.length === 0 && <p className="text-gray-500">🔍 Geen resultaten gevonden.</p>}

      {/* Tabel */}
      {filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Asset</th>
                <th className="p-2 text-right">RSI</th>
                <th className="p-2 text-right">Volume</th>
                <th className="p-2 text-right">200MA</th>
                <th className="p-2 text-right">Score</th>
                <th className="p-2 text-center">Trend</th>
                <th className="p-2 text-center">Actie</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.symbol} className="border-t">
                  <td className="p-2">{item.symbol}</td>
                  <td className="p-2 text-right">{item.rsi ?? '–'}</td>
                  <td className="p-2 text-right">{item.volume ? Number(item.volume).toLocaleString() : '–'}</td>
                  <td className="p-2 text-right">{item.ma_200 ?? '–'}</td>
                  <td className={`p-2 text-right ${scoreColor(item.score)}`}>
                    {item.score ?? '–'}
                  </td>
                  <td className="p-2 text-center">{trendEmoji(item.trend)}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeIndicator(item.symbol)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Samenvatting */}
      {!loading && (
        <div className="space-y-2 pt-4 text-sm sm:text-base">
          <p><strong>📊 Gemiddelde Technical Score:</strong> <span className={scoreColor(avgScore)}>{avgScore}</span></p>
          <p><strong>🧠 AI Advies:</strong> <span className="text-blue-600 font-medium">{advies}</span></p>
        </div>
      )}
    </div>
  );
}
