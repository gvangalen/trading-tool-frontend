'use client';
import { useReportData } from '@/hooks/useReportData';

export default function ReportPage() {
  const { report, dates, selectedDate, setSelectedDate, loading } = useReportData();

  const downloadUrl =
    selectedDate === 'latest'
      ? `/api/daily_report/export/pdf`
      : `/api/daily_report/export/pdf?date=${selectedDate}`;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📄 Dagrapport</h1>

      {/* 🔽 Datum + download */}
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="reportDateSelect" className="font-semibold">📅 Selecteer datum:</label>
        <select
          id="reportDateSelect"
          className="p-2 border rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}>
          <option value="latest">Laatste</option>
          {dates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <a
          href={downloadUrl}
          target="_blank"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          📥 Download PDF
        </a>
      </div>

      {/* 🔄 Laadstatus */}
      {loading && <p className="text-gray-500">📡 Rapport laden...</p>}
      {!loading && !report && <p className="text-red-600">❌ Rapport ophalen mislukt.</p>}

      {/* ✅ Samenvattingsblok */}
      {!loading && report && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded space-y-1 text-sm">
          <h2 className="text-lg font-semibold">📌 Samenvatting</h2>
          <p><strong>🗓️ Datum:</strong> {report.report_date}</p>
          <p><strong>🧠 BTC:</strong> {report.btc_summary}</p>
          <p><strong>📈 Advies:</strong> {report.recommendations}</p>
        </div>
      )}

      {/* ✅ Rapport-inhoud in Cards */}
      {!loading && report && (
        <div className="space-y-4">
          <ReportCard title="🧠 Samenvatting BTC" content={report.btc_summary} />
          <ReportCard title="📉 Macro Samenvatting" content={report.macro_summary} />
          <ReportCard title="📋 Setup Checklist" content={report.setup_checklist} pre />
          <ReportCard title="🎯 Dagelijkse Prioriteiten" content={report.priorities} pre />
          <ReportCard title="🔍 Wyckoff Analyse" content={report.wyckoff_analysis} pre />
          <ReportCard title="📈 Aanbevelingen" content={report.recommendations} pre />
          <ReportCard title="✅ Conclusie" content={report.conclusion} />
          <ReportCard title="🔮 Vooruitblik" content={report.outlook} pre />
        </div>
      )}
    </div>
  );
}

// ✅ Card component
function ReportCard({ title, content, pre = false }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {pre ? (
        <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">{content}</pre>
      ) : (
        <p className="text-sm text-gray-800 dark:text-gray-200">{content || '–'}</p>
      )}
    </div>
  );
}
