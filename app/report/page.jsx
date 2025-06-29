'use client';
import { useReportData } from '@/hooks/useReportData';
import ReportCard from '@/components/report/ReportCard';
import ReportContainer from '@/components/report/ReportContainer';

export default function ReportPage() {
  const { report, dates, selectedDate, setSelectedDate, loading } = useReportData();

  const downloadUrl =
    selectedDate === 'latest'
      ? `/api/daily_report/export/pdf`
      : `/api/daily_report/export/pdf?date=${selectedDate}`;

  const noRealData = !loading && (!report || dates.length === 0);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📄 Dagrapport</h1>

      {/* 🔽 Selectie + Download */}
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="reportDateSelect" className="font-semibold">📅 Selecteer datum:</label>
        <select
          id="reportDateSelect"
          className="p-2 border rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="latest">Laatste</option>
          {dates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          📥 Download PDF
        </a>
      </div>

      {/* 🔄 Laadindicator */}
      {loading && <p className="text-gray-500">📡 Rapport laden...</p>}

      {/* 🚫 Geen echte data */}
      {noRealData && (
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded text-sm">
            ⚠️ Er is nog geen echt rapport beschikbaar. Hieronder zie je een voorbeeldrapport met dummy-data.
          </div>

          <ReportContainer>
            <ReportCard
              title="🧠 Samenvatting BTC"
              content="Bitcoin consolideert na een eerdere uitbraak. RSI neutraal. Volume lager dan gemiddeld."
              full
              color="blue"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportCard title="📉 Macro Samenvatting" content="DXY stijgt licht. Fear & Greed Index toont 'Neutral'. Obligatierentes stabiel." color="gray" />
              <ReportCard title="📋 Setup Checklist" content={`✅ RSI boven 50\n❌ Volume onder gemiddelde\n✅ 200MA support intact`} pre color="green" />
              <ReportCard title="🎯 Dagelijkse Prioriteiten" content={`1. Breakout boven $70k monitoren\n2. Volume spikes volgen op 4H\n3. Setup 'Swing-BTC-Juni' valideren`} pre color="yellow" />
              <ReportCard title="🔍 Wyckoff Analyse" content="BTC bevindt zich in Phase D. Mogelijke LPS-test voor nieuwe stijging. Bevestiging nodig via volume." pre color="blue" />
              <ReportCard title="📈 Aanbevelingen" content={`• Accumulatie bij dips\n• Entry ladder tussen $66.000–$64.000\n• Alert op breakout $70.500`} pre color="red" />
              <ReportCard title="✅ Conclusie" content="BTC blijft sterk, maar bevestiging nodig via volume en breakout." color="green" />
              <ReportCard title="🔮 Vooruitblik" content="Mogelijke beweging richting $74k bij positieve macro. Anders her-test support rond $64k." pre color="gray" />
            </div>
          </ReportContainer>
        </div>
      )}

      {/* ✅ Echte data */}
      {!loading && report && (
        <ReportContainer>
          <ReportCard title="🧠 Samenvatting BTC" content={report.btc_summary} full color="blue" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportCard title="📉 Macro Samenvatting" content={report.macro_summary} color="gray" />
            <ReportCard title="📋 Setup Checklist" content={report.setup_checklist} pre color="green" />
            <ReportCard title="🎯 Dagelijkse Prioriteiten" content={report.priorities} pre color="yellow" />
            <ReportCard title="🔍 Wyckoff Analyse" content={report.wyckoff_analysis} pre color="blue" />
            <ReportCard title="📈 Aanbevelingen" content={report.recommendations} pre color="red" />
            <ReportCard title="✅ Conclusie" content={report.conclusion} color="green" />
            <ReportCard title="🔮 Vooruitblik" content={report.outlook} pre color="gray" />
          </div>
        </ReportContainer>
      )}
    </div>
  );
}
