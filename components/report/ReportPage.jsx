'use client';

import { useReportData } from '@/hooks/useReportData';
import { useEffect } from 'react';

export default function ReportPage() {
  const { report, dates, selectedDate, setSelectedDate, loading, downloadPdf } = useReportData();

  useEffect(() => {
    if (selectedDate) {
      // Laad nieuw rapport zodra selectedDate verandert (hoeft niet expliciet als hook het regelt)
    }
  }, [selectedDate]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📄 Dagelijks Tradingrapport</h2>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="dateSelect" className="font-semibold">🗓️ Rapportdatum:</label>
          <select
            id="dateSelect"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="latest">Laatste rapport</option>
            {dates.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        <button
          onClick={downloadPdf}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📥 Download als PDF
        </button>
      </div>

      {/* Rapport Content */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow min-h-[300px]">
        {loading ? (
          <p className="text-gray-500">📡 Rapport wordt geladen...</p>
        ) : report ? (
          <div className="prose dark:prose-invert max-w-none">
            {/* De API levert HTML, dus we renderen als dangerouslySetInnerHTML */}
            <div dangerouslySetInnerHTML={{ __html: report.content }} />
          </div>
        ) : (
          <p className="text-red-500">❌ Geen rapport beschikbaar.</p>
        )}
      </div>
    </div>
  );
}
