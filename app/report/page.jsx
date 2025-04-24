// ✅ app/report/page.jsx — React vervanger van report.js
'use client';
import { useReportData } from '@/hooks/useReportData';

export default function ReportPage() {
  const { report, dates, selectedDate, setSelectedDate, loading } = useReportData();

  const downloadUrl = selectedDate === 'latest'
    ? `/api/daily_report/export/pdf`
    : `/api/daily_report/export/pdf?date=${selectedDate}`;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📄 Dagrapport</h1>

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

      {loading && <p className="text-gray-500">📡 Rapport laden...</p>}

      {!loading && !report && <p className="text-red-600">❌ Rapport ophalen mislukt.</p>}

      {!loading && report && (
        <div className="space-y-6">
          <Section title="🗓️ Rapportdatum" content={report.report_date} />
          <Section title="🧠 Samenvatting BTC" content={report.btc_summary} />
          <Section title="📉 Macro Samenvatting" content={report.macro_summary} />
          <Section title="📋 Setup Checklist" content={report.setup_checklist} pre />
          <Section title="🎯 Dagelijkse Prioriteiten" content={report.priorities} pre />
          <Section title="🔍 Wyckoff Analyse" content={report.wyckoff_analysis} pre />
          <Section title="📈 Aanbevelingen" content={report.recommendations} pre />
          <Section title="✅ Conclusie" content={report.conclusion} />
          <Section title="🔮 Vooruitblik" content={report.outlook} pre />
        </div>
      )}
    </div>
  );
}

function Section({ title, content, pre = false }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      {pre ? (
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{content}</pre>
      ) : (
        <p>{content || '–'}</p>
      )}
    </div>
  );
}
