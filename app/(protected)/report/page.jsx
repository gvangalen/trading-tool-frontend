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
  Brain,
  Globe,
  ListChecks,
  Target,
  TrendingUp,
  Forward,
  FileText,
  CalendarRange,
  Download,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Activity,
} from 'lucide-react';

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
  const noRealData = !loading && (!report || Object.keys(report).length === 0);

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

      let data =
        date === 'latest' || !date
          ? await current.getLatest()
          : await current.getByDate(date);

      if ((!data || Object.keys(data).length === 0) && dateList?.length > 0) {
        const fallback = dateList[0];
        const fallbackData = await current.getByDate(fallback);
        setSelectedDate(fallback);
        setReport(fallbackData || null);
        return;
      }

      if ((!data || Object.keys(data).length === 0) && AUTO_GENERATE_IF_EMPTY) {
        await current.generate();
        setError(
          `Er was nog geen ${fallbackLabel.toLowerCase()}rapport. Generatie gestart — ververs over 1 minuut.`
        );
        return;
      }

      setReport(data || null);
    } catch (err) {
      console.error(err);
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
      alert('Rapport wordt gegenereerd. Ververs de pagina over een minuut.');
    } catch {
      alert('Rapport genereren mislukt.');
    }
  };

  const handleDownload = async () => {
    try {
      setPdfLoading(true);
      const date = selectedDate === 'latest' ? dates[0] : selectedDate;
      if (!date) return;
      await current.pdf(date);
    } catch {
      alert('Download mislukt.');
    } finally {
      setPdfLoading(false);
    }
  };

  // ✅ backward compat: als backend nog btc_summary terugstuurt
  const executiveSummary =
    report?.executive_summary || report?.btc_summary || '';

  return (
    <div className="max-w-screen-xl mx-auto pt-24 pb-10 px-4 space-y-8 bg-[var(--bg)] text-[var(--text-dark)] animate-fade-slide">

      {/* ----------------------------------------------------- */}
      {/* HEADER */}
      {/* ----------------------------------------------------- */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[var(--primary-light)] text-[var(--primary)] rounded-xl">
              <FileText size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Rapportage ({fallbackLabel})
            </h1>
          </div>
          <p className="text-sm text-[var(--text-light)]">
            AI-gegenereerde markt- en tradingrapporten.
          </p>
        </div>

        {report?.report_date && (
          <div className="text-xs bg-[var(--bg-soft)] border border-[var(--border)] px-3 py-1 rounded-full inline-flex items-center gap-2">
            <CalendarRange size={14} />
            {report.report_date}
          </div>
        )}
      </header>

      {/* ----------------------------------------------------- */}
      {/* TABS + FILTER BAR */}
      {/* ----------------------------------------------------- */}
      <CardWrapper>
        <div className="space-y-5">
          <ReportTabs selected={reportType} onChange={setReportType} />

          <div className="flex flex-wrap items-center gap-3 bg-[var(--bg-soft)] border border-[var(--border)] px-4 py-3 rounded-2xl">

            {/* Date select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--text-light)] flex items-center gap-1">
                <CalendarRange size={14} /> Selecteer:
              </span>

              <select
                className="px-3 py-2 text-xs md:text-sm rounded-xl bg-[var(--bg)] border border-[var(--border)]"
                value={selectedDate}
                onChange={(e) => loadData(e.target.value)}
              >
                <option value="latest">Laatste</option>
                {dates.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex-1" />

            {/* PDF BTN */}
            <button
              onClick={handleDownload}
              disabled={pdfLoading}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium shadow-sm
                ${
                  pdfLoading
                    ? 'bg-gray-300 text-gray-600'
                    : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'
                }
              `}
            >
              {pdfLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {pdfLoading ? 'Downloaden…' : 'Download PDF'}
            </button>

            {/* Generate BTN */}
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm border border-[var(--border)] hover:bg-[var(--primary-light)]"
            >
              <RefreshCw size={14} />
              Genereer rapport
            </button>
          </div>
        </div>
      </CardWrapper>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
          <AlertTriangle size={16} />
          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-[var(--text-light)]">
          <Loader2 size={16} className="animate-spin" />
          Rapport laden…
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* DUMMY REPORT */}
      {/* ----------------------------------------------------- */}
      {noRealData && <DummyReportNew />}

      {/* ----------------------------------------------------- */}
      {/* REAL REPORT */}
      {/* ----------------------------------------------------- */}
      {!loading && report && Object.keys(report).length > 0 && (
        <ReportContainer>
          {/* Top full-width card */}
          <ReportCard
            icon={<Brain size={18} />}
            title="Executive Summary"
            content={executiveSummary}
            full
            color="blue"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Market snapshot card (data) */}
            <ReportCard
              icon={<TrendingUp size={18} />}
              title="Market Snapshot"
              content={formatMarketSnapshot(report)}
              pre
              color="blue"
            />

            <ReportCard
              icon={<Globe size={18} />}
              title="Macro Context"
              content={report.macro_summary || '–'}
              color="gray"
            />

            <ReportCard
              icon={<ListChecks size={18} />}
              title="Setup Validatie"
              content={report.setup_validation || report.setup_checklist || '–'}
              pre
              color="green"
            />

            <ReportCard
              icon={<Target size={18} />}
              title="Strategie Implicatie"
              content={report.strategy_implication || report.recommendations || '–'}
              pre
              color="red"
            />

            <ReportCard
              icon={<Activity size={18} />}
              title="Indicator Highlights"
              content={formatIndicatorHighlights(report)}
              pre
              color="gray"
            />

            <ReportCard
              icon={<Forward size={18} />}
              title="Vooruitblik"
              content={report.outlook || '–'}
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
   Helpers (UI formatting)
--------------------------------------------------- */
function formatMarketSnapshot(report) {
  const m = report?.market_data || {};
  const price = m?.price ?? '–';
  const ch24 = m?.change_24h ?? '–';
  const vol = m?.volume ?? '–';

  const scores = report?.scores || {};
  const macro = scores?.macro_score ?? '–';
  const tech = scores?.technical_score ?? '–';
  const market = scores?.market_score ?? '–';
  const setup = scores?.setup_score ?? '–';

  return `Prijs: $${price}
24h: ${ch24}%
Volume: ${vol}

Scores:
Macro: ${macro}
Technical: ${tech}
Market: ${market}
Setup: ${setup}`;
}

function formatIndicatorHighlights(report) {
  const inds = report?.market_indicator_scores || [];
  if (!Array.isArray(inds) || inds.length === 0) {
    return 'Geen indicator-scores gevonden voor vandaag.';
  }

  const top = inds.slice(0, 5);
  return top
    .map((i) => {
      const name = i?.indicator ?? '–';
      const score = i?.score ?? '–';
      const interp = i?.interpretation ?? '–';
      return `- ${name}: score ${score} → ${interp}`;
    })
    .join('\n');
}

/* ---------------------------------------------------
   Dummy report (nieuwe structuur)
--------------------------------------------------- */
function DummyReportNew() {
  return (
    <ReportContainer>
      <ReportCard
        icon={<Brain size={18} />}
        title="Executive Summary"
        content={`BTC consolideert. Macro neutraal. Setup-score onder threshold → geen agressieve entries.\n\nBESLISSING VANDAAG: OBSERVEREN\nCONFIDENCE: MIDDEL`}
        full
        color="blue"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReportCard
          icon={<TrendingUp size={18} />}
          title="Market Snapshot"
          content={`Prijs: $–\n24h: –%\nVolume: –\n\nScores:\nMacro: –\nTechnical: –\nMarket: –\nSetup: –`}
          pre
          color="blue"
        />

        <ReportCard
          icon={<Globe size={18} />}
          title="Macro Context"
          content={`Trend: –\nBias: –\nRisico: –\n\nMACRO-IMPACT: NEUTRAAL`}
          color="gray"
        />

        <ReportCard
          icon={<ListChecks size={18} />}
          title="Setup Validatie"
          content={`SETUP-STATUS: CONDITIONAL\nRELEVANTIE: KOMENDE_DAGEN`}
          pre
          color="green"
        />

        <ReportCard
          icon={<Target size={18} />}
          title="Strategie Implicatie"
          content={`STRATEGIE-STATUS: WACHT_OP_TRIGGER`}
          pre
          color="red"
        />

        <ReportCard
          icon={<Activity size={18} />}
          title="Indicator Highlights"
          content={`- price: score – → –\n- volume: score – → –\n- change_24h: score – → –`}
          pre
          color="gray"
        />

        <ReportCard
          icon={<Forward size={18} />}
          title="Vooruitblik"
          content={`Bullish: –\nBearish: –\nConsolidatie: –`}
          pre
          color="gray"
        />
      </div>
    </ReportContainer>
  );
}
