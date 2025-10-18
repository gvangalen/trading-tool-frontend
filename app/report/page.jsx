'use client';
console.log('✅ ReportPage component geladen');

import { useState, useEffect } from 'react';
import {
  // DAILY
  fetchDailyReportLatest,
  fetchDailyReportByDate,
  fetchDailyReportDates,
  generateDailyReport,
  fetchDailyReportPDF,
  // WEEKLY
  fetchWeeklyReportLatest,
  fetchWeeklyReportByDate,
  fetchWeeklyReportDates,
  generateWeeklyReport,
  fetchWeeklyReportPDF,
  // MONTHLY
  fetchMonthlyReportLatest,
  fetchMonthlyReportByDate,
  fetchMonthlyReportDates,
  generateMonthlyReport,
  fetchMonthlyReportPDF,
  // QUARTERLY
  fetchQuarterlyReportLatest,
  fetchQuarterlyReportByDate,
  fetchQuarterlyReportDates,
  generateQuarterlyReport,
  fetchQuarterlyReportPDF,
} from '@/lib/api/reportService';
import ReportCard from '@/components/report/ReportCard';
import ReportContainer from '@/components/report/ReportContainer';
import ReportTabs from '@/components/report/ReportTabs';

const REPORT_TYPES = {
  daily: 'Dag',
  weekly: 'Week',
  monthly: 'Maand',
  quarterly: 'Kwartaal',
};

const AUTO_GENERATE_IF_EMPTY = true;

export default function ReportPage() {
  const [reportType, setReportType] = useState('daily');
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fallbackLabel = REPORT_TYPES[reportType] || 'Rapport';
  const noRealData = !loading && (!report || Object.keys(report || {}).length === 0);

  // ✅ Helper om per type de juiste functies te kiezen
  const reportFns = {
    daily: {
      getLatest: fetchDailyReportLatest,
      getByDate: fetchDailyReportByDate,
      getDates: fetchDailyReportDates,
      generate: generateDailyReport,
      pdf: fetchDailyReportPDF,
    },
    weekly: {
      getLatest: fetchWeeklyReportLatest,
      getByDate: fetchWeeklyReportByDate,
      getDates: fetchWeeklyReportDates,
      generate: generateWeeklyReport,
      pdf: fetchWeeklyReportPDF,
    },
    monthly: {
      getLatest: fetchMonthlyReportLatest,
      getByDate: fetchMonthlyReportByDate,
      getDates: fetchMonthlyReportDates,
      generate: generateMonthlyReport,
      pdf: fetchMonthlyReportPDF,
    },
    quarterly: {
      getLatest: fetchQuarterlyReportLatest,
      getByDate: fetchQuarterlyReportByDate,
      getDates: fetchQuarterlyReportDates,
      generate: generateQuarterlyReport,
      pdf: fetchQuarterlyReportPDF,
    },
  };

  const current = reportFns[reportType];

  // 🔄 Hoofdfunctie voor data laden
  const loadData = async (date = selectedDate) => {
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const dateList = await current.getDates();
      setDates(dateList || []);

      let data = null;
      if (date === 'latest' || !date) {
        data = await current.getLatest();
      } else {
        data = await current.getByDate(date);
      }

      // Fallback
      if ((!data || Object.keys(data).length === 0) && dateList?.length > 0) {
        const fallback = dateList[0];
        console.warn(`⚠️ Geen 'latest' rapport. Fallback naar ${fallback}`);
        const fallbackData = await current.getByDate(fallback);
        setSelectedDate(fallback);
        setReport(fallbackData || null);
        return;
      }

      // Auto generate
      if ((!data || Object.keys(data).length === 0) && AUTO_GENERATE_IF_EMPTY) {
        console.warn(`⚙️ Geen ${reportType}-rapport. Start automatische generatie...`);
        await current.generate();
        setError(`Er was nog geen ${reportType}-rapport. Generatie gestart — ververs over 1 minuut.`);
        return;
      }

      setReport(data || null);
    } catch (err) {
      console.error(`❌ Fout bij laden ${reportType}-rapport:`, err);
      setError('Rapport kon niet geladen worden.');
    } finally {
      setLoading(false);
    }
  };

  // 📡 Laad rapport bij wijziging type
  useEffect(() => {
    loadData('latest');
  }, [reportType]);

  // 🔁 Handmatig genereren
  const handleGenerate = async () => {
    try {
      await current.generate();
      alert('✅ Rapportgeneratie gestart. Even wachten en daarna vernieuwen.');
    } catch (err) {
      console.error('❌ Rapportgeneratie mislukt:', err);
      alert('❌ Rapport genereren mislukt.');
    }
  };

  // 🧾 PDF Download
  const handleDownload = async () => {
    try {
      const date = selectedDate === 'latest' ? dates[0] : selectedDate;
      if (!date) return alert('⚠️ Geen datum geselecteerd.');
      await current.pdf(date);
    } catch (err) {
      console.error('❌ Download mislukt:', err);
      alert('❌ Download mislukt.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📊 Rapportage ({fallbackLabel})</h1>

      <ReportTabs selected={reportType} onChange={setReportType} />

      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="reportDateSelect" className="font-semibold">
          📅 Selecteer datum:
        </label>
        <select
          id="reportDateSelect"
          className="p-2 border rounded"
          value={selectedDate}
          onChange={async (e) => {
            const value = e.target.value;
            setSelectedDate(value);
            await loadData(value);
          }}
        >
          <option value="latest">Laatste</option>
          {dates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          📥 Download PDF
        </button>

        <button
          onClick={handleGenerate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          🔄 Genereer rapport
        </button>
      </div>

      {loading && <p className="text-gray-500">📡 Rapport laden...</p>}
      {error && <p className="text-red-600">❌ {error}</p>}

      {noRealData && (
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded text-sm">
            ⚠️ Er is nog geen {fallbackLabel.toLowerCase()}rapport beschikbaar.
            Hieronder zie je een voorbeeldrapport met dummy-data.
          </div>
          <DummyReport />
        </div>
      )}

      {!loading && report && Object.keys(report).length > 0 && (
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

// Dummy fallback
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
        <ReportCard
          title="📉 Macro Samenvatting"
          content="DXY stijgt licht. Fear & Greed Index toont 'Neutral'. Obligatierentes stabiel."
          color="gray"
        />
        <ReportCard
          title="📋 Setup Checklist"
          content={`✅ RSI boven 50\n❌ Volume onder gemiddelde\n✅ 200MA support intact`}
          pre
          color="green"
        />
        <ReportCard
          title="🎯 Dagelijkse Prioriteiten"
          content={`1. Breakout boven $70k monitoren\n2. Volume spikes volgen op 4H\n3. Setup 'Swing-BTC-Juni' valideren`}
          pre
          color="yellow"
        />
        <ReportCard
          title="🔍 Wyckoff Analyse"
          content="BTC bevindt zich in Phase D. Mogelijke LPS-test voor nieuwe stijging. Bevestiging nodig via volume."
          pre
          color="blue"
        />
        <ReportCard
          title="📈 Aanbevelingen"
          content={`• Accumulatie bij dips\n• Entry ladder tussen $66.000–$64.000\n• Alert op breakout $70.500`}
          pre
          color="red"
        />
        <ReportCard
          title="✅ Conclusie"
          content="BTC blijft sterk, maar bevestiging nodig via volume en breakout."
          color="green"
        />
        <ReportCard
          title="🔮 Vooruitblik"
          content="Mogelijke beweging richting $74k bij positieve macro. Anders her-test support rond $64k."
          pre
          color="gray"
        />
      </div>
    </ReportContainer>
  );
}
