'use client';

import { useReportData } from '@/hooks/useReportData';
import ReportCard from '@/components/report/ReportCard';
import ReportCardGrid from '@/components/report/ReportCardGrid';
import ReportContainer from '@/components/report/ReportContainer';

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

      {/* 🔄 Laadstatus */}
      {loading && <p className="text-gray-500">📡 Rapport laden...</p>}

      {/* 🚫 Geen echte data */}
      {noRealData && (
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100 rounded text-sm">
            ⚠️ Er is nog geen echt rapport beschikbaar. Hieronder zie je een voorbeeldrapport met dummy-data.
          </div>

          <ReportContainer>
            <ReportCardGrid>
              <ReportCard title="🧠 Samenvatting BTC">
                <ul className="list-disc pl-5">
                  <li>Bitcoin consolideert na een eerdere uitbraak.</li>
                  <li>RSI neutraal.</li>
                  <li>Volume lager dan gemiddeld.</li>
                </ul>
              </ReportCard>
              <ReportCard title="📉 Macro Samenvatting">
                DXY stijgt licht. Fear & Greed Index toont 'Neutral'. Obligatierentes stabiel.
              </ReportCard>
              <ReportCard title="📋 Setup Checklist">
                <ul className="list-disc pl-5">
                  <li>✅ RSI boven 50</li>
                  <li>❌ Volume onder gemiddelde</li>
                  <li>✅ 200MA support intact</li>
                </ul>
              </ReportCard>
              <ReportCard title="🎯 Dagelijkse Prioriteiten">
                <ol className="list-decimal pl-5">
                  <li>Breakout boven $70k monitoren</li>
                  <li>Volume spikes volgen op 4H</li>
                  <li>Setup 'Swing-BTC-Juni' valideren</li>
                </ol>
              </ReportCard>
              <ReportCard title="🔍 Wyckoff Analyse">
                BTC bevindt zich in Phase D. Mogelijke LPS-test voor nieuwe stijging. Bevestiging nodig via volume.
              </ReportCard>
              <ReportCard title="📈 Aanbevelingen">
                <ul className="list-disc pl-5">
                  <li>Accumulatie bij dips</li>
                  <li>Entry ladder tussen $66.000–$64.000</li>
                  <li>Alert op breakout $70.500</li>
                </ul>
              </ReportCard>
              <ReportCard title="✅ Conclusie">
                BTC blijft sterk, maar bevestiging nodig via volume en breakout.
              </ReportCard>
              <ReportCard title="🔮 Vooruitblik">
                Mogelijke beweging richting $74k bij positieve macro. Anders her-test support rond $64k.
              </ReportCard>
            </ReportCardGrid>
          </ReportContainer>
        </div>
      )}

      {/* ✅ Echte data */}
      {!loading && report && (
        <ReportContainer>
          <ReportCardGrid>
            <ReportCard title="🧠 Samenvatting BTC">
              {report.btc_summary}
            </ReportCard>
            <ReportCard title="📉 Macro Samenvatting">
              {report.macro_summary}
            </ReportCard>
            <ReportCard title="📋 Setup Checklist">
              <pre className="whitespace-pre-wrap">{report.setup_checklist}</pre>
            </ReportCard>
            <ReportCard title="🎯 Dagelijkse Prioriteiten">
              <pre className="whitespace-pre-wrap">{report.priorities}</pre>
            </ReportCard>
            <ReportCard title="🔍 Wyckoff Analyse">
              <pre className="whitespace-pre-wrap">{report.wyckoff_analysis}</pre>
            </ReportCard>
            <ReportCard title="📈 Aanbevelingen">
              <pre className="whitespace-pre-wrap">{report.recommendations}</pre>
            </ReportCard>
            <ReportCard title="✅ Conclusie">
              {report.conclusion}
            </ReportCard>
            <ReportCard title="🔮 Vooruitblik">
              <pre className="whitespace-pre-wrap">{report.outlook}</pre>
            </ReportCard>
          </ReportCardGrid>
        </ReportContainer>
      )}
    </div>
  );
}
