'use client';

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
} from '@/lib/api/report';

import ReportCard from '@/components/report/ReportCard';
import ReportContainer from '@/components/report/ReportContainer';
import ReportTabs from '@/components/report/ReportTabs';
import CardWrapper from '@/components/ui/CardWrapper';

import {
  FileText,
  CalendarRange,
  Download,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

// 🔁 Valuta formatter
const formatCurrency = (amount, currency = 'EUR') =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);

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
  const [pdfLoading, setPdfLoading] = useState(false);

  const fallbackLabel = REPORT_TYPES[reportType] || 'Rapport';
  const noRealData = !loading && (!report || Object.keys(report || {}).length === 0);

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

      if ((!data || Object.keys(data).length === 0) && dateList?.length > 0) {
        const fallback = dateList[0];
        console.warn(`⚠️ Geen 'latest' rapport. Fallback naar ${fallback}`);
        const fallbackData = await current.getByDate(fallback);
        setSelectedDate(fallback);
        setReport(fallbackData || null);
        return;
      }

      if ((!data || Object.keys(data).length === 0) && AUTO_GENERATE_IF_EMPTY) {
        console.warn(`⚙️ Geen ${reportType}-rapport. Start automatische generatie...`);
        await current.generate();
        setError(
          `Er was nog geen ${fallbackLabel.toLowerCase()}rapport. Generatie gestart — ververs over 1 minuut.`
        );
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

  useEffect(() => {
    loadData('latest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType]);

  const handleGenerate = async () => {
    try {
      await current.generate();
      alert('✅ Rapportgeneratie gestart. Even wachten en daarna vernieuwen.');
    } catch (err) {
      console.error('❌ Rapportgeneratie mislukt:', err);
      alert('❌ Rapport genereren mislukt.');
    }
  };

  const handleDownload = async () => {
    try {
      setPdfLoading(true);
      const date = selectedDate === 'latest' ? dates[0] : selectedDate;
      if (!date) return alert('⚠️ Geen datum geselecteerd.');
      await current.pdf(date);
    } catch (err) {
      console.error('❌ Download mislukt:', err);
      alert('❌ Download mislukt.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div
      className="
        max-w-screen-xl mx-auto 
        pt-24 pb-10 px-4 
        space-y-8 
        bg-[var(--bg)]
        text-[var(--text-dark)]
        animate-fade-slide
      "
    >
      {/* HEADER */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="
                inline-flex items-center justify-center 
                w-9 h-9 rounded-xl 
                bg-[var(--primary-light)] 
                text-[var(--primary)]
              "
            >
              <FileText size={18} />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Rapportage ({fallbackLabel})
            </h1>
          </div>

          <p className="text-sm text-[var(--text-light)]">
            Overzicht van je AI-gegenereerde dagelijkse, wekelijkse, maandelijkse en kwartaalrapporten.
          </p>
        </div>

        {/* Datum / meta */}
        <div className="flex flex-col items-start md:items-end gap-1">
          {report?.report_date && (
            <div
              className="
                inline-flex items-center gap-2 
                px-3 py-1 rounded-full 
                bg-[var(--bg-soft)] 
                border border-[var(--border)]
                text-xs font-medium
              "
            >
              <CalendarRange size={14} className="text-[var(--text-light)]" />
              <span>Rapportdatum: {report.report_date}</span>
            </div>
          )}
          {loading && (
            <span className="text-xs text-[var(--text-light)] flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              Rapport wordt geladen…
            </span>
          )}
        </div>
      </header>

      {/* TYPE TABS + FILTER BAR */}
      <CardWrapper>
        <div className="space-y-4">
          {/* Tabs */}
          <ReportTabs selected={reportType} onChange={setReportType} />

          {/* Filter / acties */}
          <div
            className="
              flex flex-wrap items-center gap-3
              bg-[var(--bg-soft)]
              border border-[var(--border)]
              rounded-2xl
              px-4 py-3
            "
          >
            {/* Date select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--text-light)] flex items-center gap-1">
                <CalendarRange size={14} />
                Selecteer datum:
              </span>
              <select
                id="reportDateSelect"
                className="
                  text-xs md:text-sm
                  px-3 py-2
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--bg)]
                  text-[var(--text-dark)]
                  focus:outline-none
                  focus:ring-1 focus:ring-[var(--primary)]
                "
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
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownload}
                className={`
                  inline-flex items-center gap-2
                  px-3 md:px-4 py-2
                  rounded-xl text-xs md:text-sm font-medium
                  shadow-sm
                  ${
                    pdfLoading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'
                  }
                `}
                disabled={pdfLoading}
              >
                {pdfLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Downloaden...
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    Download PDF
                  </>
                )}
              </button>

              <button
                onClick={handleGenerate}
                className="
                  inline-flex items-center gap-2
                  px-3 md:px-4 py-2
                  rounded-xl text-xs md:text-sm font-medium
                  border border-[var(--border)]
                  bg-[var(--bg)]
                  text-[var(--text-dark)]
                  hover:bg-[var(--primary-light)]
                  transition
                "
              >
                <RefreshCw size={14} />
                Genereer rapport
              </button>
            </div>
          </div>
        </div>
      </CardWrapper>

      {/* STATUS / FOUTEN */}
      {error && (
        <div
          className="
            flex items-start gap-2
            bg-yellow-50 border border-yellow-200
            text-yellow-800 text-sm
            px-4 py-3 rounded-xl
          "
        >
          <AlertTriangle size={16} className="mt-[2px]" />
          <p>{error}</p>
        </div>
      )}

      {/* LOADING INDICATOR (extra, boven content) */}
      {loading && !error && (
        <div className="text-sm text-[var(--text-light)] flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          <span>Rapport wordt geladen…</span>
        </div>
      )}

      {/* GEEN ECHTE DATA → DUMMY RAPPORT */}
      {noRealData && (
        <div className="space-y-6">
          <div
            className="
              flex items-start gap-2
              bg-yellow-50 border border-yellow-200
              text-yellow-800 text-sm
              px-4 py-3 rounded-xl
            "
          >
            <AlertTriangle size={16} className="mt-[2px]" />
            <p>
              Er is nog geen {fallbackLabel.toLowerCase()}rapport beschikbaar.
              Hieronder zie je een voorbeeldrapport met dummy-data.
            </p>
          </div>

          <DummyReport />
        </div>
      )}

      {/* ECHT RAPPORT */}
      {!loading && report && Object.keys(report).length > 0 && (
        <ReportContainer>
          <ReportCard
            title="🧠 Samenvatting BTC"
            content={report?.btc_summary}
            full
            color="blue"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportCard
              title="📉 Macro Samenvatting"
              content={report?.macro_summary}
              color="gray"
            />
            <ReportCard
              title="📋 Setup Checklist"
              content={report?.setup_checklist}
              pre
              color="green"
            />
            <ReportCard
              title="🎯 Dagelijkse Prioriteiten"
              content={report?.priorities}
              pre
              color="yellow"
            />
            <ReportCard
              title="🔍 Wyckoff Analyse"
              content={report?.wyckoff_analysis}
              pre
              color="blue"
            />
            <ReportCard
              title="📈 Aanbevelingen"
              content={report?.recommendations}
              pre
              color="red"
            />
            <ReportCard
              title="✅ Conclusie"
              content={report?.conclusion}
              color="green"
            />
            <ReportCard
              title="🔮 Vooruitblik"
              content={report?.outlook}
              pre
              color="gray"
            />
          </div>
        </ReportContainer>
      )}
    </div>
  );
}

/* ---------------------------------------------------
   💡 Dummy Report – zelfde 2.5 style
--------------------------------------------------- */
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
          content={`1. Breakout boven €70.000 monitoren\n2. Volume spikes volgen op 4H\n3. Setup 'Swing-BTC-Juni' valideren`}
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
          content={`• Accumulatie bij dips\n• Entry ladder tussen ${formatCurrency(
            64000
          )}–${formatCurrency(66000)}\n• Alert op breakout ${formatCurrency(70500)}`}
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
          content="Mogelijke beweging richting €74.000 bij positieve macro. Anders her-test support rond €64.000."
          pre
          color="gray"
        />
      </div>
    </ReportContainer>
  );
}
