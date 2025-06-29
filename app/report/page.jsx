'use client';
import { useReportData } from '@/hooks/useReportData';
import ReportCard from '@/components/report/ReportCard';
import ReportCardGrid from '@/components/report/ReportCardGrid';

export default function ReportPage() {
  const { report, dates, selectedDate, setSelectedDate, loading } = useReportData();

  const downloadUrl =
    selectedDate === 'latest'
      ? `/api/daily_report/export/pdf`
      : `/api/daily_report/export/pdf?date=${selectedDate}`;

  const noRealData = !loading && (!report || dates.length === 0);

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
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          📥 Download PDF
        </a>
      </div>

      {/* 🔄 Laadstatus */}
      {loading && <p className="text-gray-500">📡 Rapport laden...</p>}

      {/* 🚫 Geen echte data → toon voorbeeldrapport + waarschuwing */}
      {noRealData && (
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100 rounded text-sm">
            ⚠️ Er is nog geen echt rapport beschikbaar. Hieronder zie je een voorbeeldrapport met dummy-data.
          </div>

          <ReportCardGrid>
            <ReportCard title="🧠 Samenvatting BTC" color="blue">
              Bitcoin consolideert na een eerdere uitbraak. RSI neutraal. Volume lager dan gemiddeld.
            </ReportCard>
            <ReportCard title="📉 Macro Samenvatting" color="gray">
              DXY stijgt licht. Fear & Greed Index toont 'Neutral'. Obligatierentes stabiel.
            </ReportCard>
            <ReportCard title="📋 Setup Checklist" color="green">
              <pre className="whitespace-pre-wrap">
                ✅ RSI boven 50{'\n'}
                ❌ Volume onder gemiddelde{'\n'}
                ✅ 200MA support intact
              </pre>
            </ReportCard>
            <ReportCard title="🎯 Dagelijkse Prioriteiten" color="yellow">
              <pre className="whitespace-pre-wrap">
                1. Breakout boven $70k monitoren{'\n'}
                2. Volume spikes volgen op 4H{'\n'}
                3. Setup ‘Swing-BTC-Juni’ valideren
              </pre>
            </ReportCard>
            <ReportCard title="🔍 Wyckoff Analyse" color="blue">
              <pre className="whitespace-pre-wrap">
                BTC bevindt zich in Phase D. Mogelijke LPS-test voor nieuwe stijging. Bevestiging nodig via volume.
              </pre>
            </ReportCard>
            <ReportCard title="📈 Aanbevelingen" color="red">
              <pre className="whitespace-pre-wrap">
                • Accumulatie bij dips{'\n'}
                • Entry ladder tussen $66.000–$64.000{'\n'}
                • Alert op breakout $70.500
              </pre>
            </ReportCard>
            <ReportCard title="✅ Conclusie" color="green">
              BTC blijft sterk, maar bevestiging nodig via volume en breakout.
            </ReportCard>
            <ReportCard title="🔮 Vooruitblik" color="gray">
              <pre className="whitespace-pre-wrap">
                Mogelijke beweging richting $74k bij positieve macro. Anders her-test support rond $64k.
              </pre>
            </ReportCard>
          </ReportCardGrid>
        </div>
      )}

      {/* ✅ Echte data in kleurrijke grid */}
      {!loading && report && (
        <ReportCardGrid>
          <ReportCard title="🧠 Samenvatting BTC" color="blue">{report.btc_summary}</ReportCard>
          <ReportCard title="📉 Macro Samenvatting" color="gray">{report.macro_summary}</ReportCard>
          <ReportCard title="📋 Setup Checklist" color="green">
            <pre className="whitespace-pre-wrap">{report.setup_checklist}</pre>
          </ReportCard>
          <ReportCard title="🎯 Dagelijkse Prioriteiten" color="yellow">
            <pre className="whitespace-pre-wrap">{report.priorities}</pre>
          </ReportCard>
          <ReportCard title="🔍 Wyckoff Analyse" color="blue">
            <pre className="whitespace-pre-wrap">{report.wyckoff_analysis}</pre>
          </ReportCard>
          <ReportCard title="📈 Aanbevelingen" color="red">
            <pre className="whitespace-pre-wrap">{report.recommendations}</pre>
          </ReportCard>
          <ReportCard title="✅ Conclusie" color="green">{report.conclusion}</ReportCard>
          <ReportCard title="🔮 Vooruitblik" color="gray">
            <pre className="whitespace-pre-wrap">{report.outlook}</pre>
          </ReportCard>
        </ReportCardGrid>
      )}
    </div>
  );
}
