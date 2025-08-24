'use client';
console.log('✅ ReportPage component geladen');

import { useState } from 'react';
import { useReportData } from '@/hooks/useReportData';
import { generateReport } from '@/lib/api/report'; // ✅ Import toegevoegd
import ReportCard from '@/components/report/ReportCard';
import ReportContainer from '@/components/report/ReportContainer';
import ReportTabs from '@/components/report/ReportTabs';

const REPORT_TYPES = {
  daily: 'Dag',
  weekly: 'Week',
  monthly: 'Maand',
  quarterly: 'Kwartaal',
};

export default function ReportPage() {
  const [reportType, setReportType] = useState('daily');
  const {
    report,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error,
  } = useReportData(reportType);

  const fallbackLabel = REPORT_TYPES[reportType] || 'Rapport';
  const downloadUrl = `/api/report/${reportType}/export/pdf?date=${selectedDate}`;
  const noRealData = !loading && (!report || dates.length === 0);

  // ✅ Gebruik de API-helper i.p.v. hardcoded fetch
  const handleGenerate = async () => {
    try {
      await generateReport(reportType);
      alert('✅ Rapport gegenereerd. Ververs pagina over een paar seconden.');
    } catch (err) {
      alert('❌ Rapport genereren mislukt.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📊 Rapportage ({fallbackLabel})</h1>

      <ReportTabs selected={reportType} onChange={setReportType} />

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
          download
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          📥 Download PDF
        </a>

        <button
          onClick={handleGenerate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          🔄 Genereer rapport
        </button>
      </div>

      {selectedDate !== 'latest' && report && (
        <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 p-3 rounded text-sm">
          ⚠️ Het laatste rapport was niet beschikbaar. Fallback gebruikt: <strong>{selectedDate}</strong>.
        </div>
      )}

      {loading && <p className="text-gray-500">📡 Rapport laden...</p>}
      {error && <p className="text-red-600">❌ {error}</p>}

      {noRealData && (
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded text-sm dark:bg-yellow-900 dark:text-yellow-200">
            ⚠️ Er is nog geen {fallbackLabel.toLowerCase()}rapport beschikbaar. Hieronder zie je een voorbeeldrapport met dummy-data.
          </div>
          <DummyReport />
        </div>
      )}

      {!loading && report && (
        <ReportContainer>
          <ReportCard title="🧠 Samenvatting BTC" content={report?.btc_summary} full color="blue" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportCard title="📉 Macro Samenvatting" content={report?.macro_summary} color="gray" />
            <ReportCard title="📋 Setup Checklist" content={report?.setup_checklist} pre color="green" />
            <ReportCard title="🎯 Dagelijkse Prioriteiten" content={report?.priorities} pre color="yellow" />
            <ReportCard title="🔍 Wyckoff Analyse" content={report?.wyckoff_analysis} pre color="blue" />
            <ReportCard title="📈 Aanbevelingen" content={report?.recommendations} pre color="red" />
            <ReportCard title="✅ Conclusie" content={report?.conclusion} color="green" />
            <ReportCard title="🔮 Vooruitblik" content={report?.outlook} pre color="gray" />
          </div>
        </ReportContainer>
      )}
    </div>
  );
}

// 🔁 Dummy fallback voor als er geen echte data is
function DummyReport() {
  return (
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
  );
}
