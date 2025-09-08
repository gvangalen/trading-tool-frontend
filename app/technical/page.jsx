'use client';
import { useTechnicalData } from '@/hooks/useTechnicalData';
import { useState } from 'react';

export default function TechnicalPage() {
  const {
    technicalData,
    avgScore,
    advies,
    deleteAsset,
    loading,
    error,
    calculateTechnicalScore,
  } = useTechnicalData();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = technicalData.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function scoreColor(score) {
    if (score >= 2) return 'text-green-600 font-bold';
    if (score >= 1) return 'text-yellow-500 font-semibold';
    if (score >= 0) return 'text-orange-500';
    return 'text-red-500';
  }

  function trendEmoji(score) {
    if (score >= 1.5) return '📈';
    if (score <= -1.5) return '📉';
    return '⚖️';
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">📉 Technische Analyse</h2>

      {/* 🔍 Zoekveld */}
      <input
        type="text"
        placeholder="🔍 Zoek asset"
        className="border p-2 rounded w-full sm:w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 🔄 Status */}
      {loading && <p className="text-gray-600">⏳ Laden...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}
      {!loading && filteredData.length === 0 && <p className="text-gray-500">Geen resultaten</p>}

      {/* 📊 Tabel */}
      {filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto border-collapse">
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
              {filteredData.map((item) => {
                const score = calculateTechnicalScore(item);
                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{item.symbol}</td>
                    <td className="p-2 text-right">{item.rsi ?? '–'}</td>
                    <td className="p-2 text-right">
                      {item.volume ? Number(item.volume).toLocaleString() : '–'}
                    </td>
                    <td className="p-2 text-right">{item.ma_200 ?? '–'}</td>
                    <td className={`p-2 text-right ${scoreColor(score)}`}>{score}</td>
                    <td className="p-2 text-center">{trendEmoji(score)}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deleteAsset(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 📈 Samenvatting */}
      {!loading && (
        <div className="pt-4 text-sm sm:text-base space-y-2">
          <p>
            <strong>📊 Gemiddelde Score:</strong>{' '}
            <span className={scoreColor(avgScore)}>{avgScore}</span>
          </p>
          <p>
            <strong>🧠 Advies:</strong>{' '}
            <span className="text-blue-600 font-medium">{advies}</span>
          </p>
        </div>
      )}
    </div>
  );
}
