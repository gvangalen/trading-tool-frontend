'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
import AILoader from '@/components/ui/AILoader';

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

/* =====================================================
   CONFIG
===================================================== */

const REPORT_TYPES = {
  daily: 'Dag',
  weekly: 'Week',
  monthly: 'Maand',
  quarterly: 'Kwartaal',
};

const AUTO_GENERATE_IF_EMPTY = true;
const POLL_INTERVAL_MS = 4000;
const POLL_MAX_ATTEMPTS = 60;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* =====================================================
   JSON HELPERS
===================================================== */

function renderJson(value) {
  if (value === null || value === undefined) return '–';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function parseJsonMaybe(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return null;
}

function sortDatesDesc(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => (a < b ? 1 : -1));
}

/* =====================================================
   PAGE
===================================================== */

export default function ReportPage() {
  const [reportType, setReportType] = useState('daily');
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateInfo, setGenerateInfo] = useState('');
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  const pollTokenRef = useRef(0);
  const lastGeneratedAtRef = useRef(null);

  const fallbackLabel = REPORT_TYPES[reportType] || 'Rapport';

  const noRealData =
    !loading && !generating && (!report || Object.keys(report).length === 0);

  const reportFns = useMemo(
    () => ({
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
    }),
    []
  );

  const current = reportFns[reportType];

  /* =====================================================
     🔥 POLLING OP generated_at (DE FIX)
  ===================================================== */

  const pollUntilGeneratedAtChanges = async () => {
    const myToken = ++pollTokenRef.current;

    for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
      if (pollTokenRef.current !== myToken) return null;

      try {
        const latest = await current.getLatest();
        if (
          latest?.generated_at &&
          latest.generated_at !== lastGeneratedAtRef.current
        ) {
          return latest;
        }
      } catch {}

      await sleep(POLL_INTERVAL_MS);
    }

    return null;
  };

  /* =====================================================
     LOAD
  ===================================================== */

  const loadData = async (date = 'latest') => {
    setLoading(true);
    setError('');

    try {
      const rawDates = await current.getDates();
      const sorted = sortDatesDesc(rawDates || []);
      setDates(sorted);

      let data =
        date === 'latest'
          ? await current.getLatest()
          : await current.getByDate(date);

      if (!data && sorted.length > 0 && date === 'latest') {
        data = await current.getByDate(sorted[0]);
        setSelectedDate(sorted[0]);
      }

      if (!data && AUTO_GENERATE_IF_EMPTY) {
        await handleGenerate();
        return;
      }

      setReport(data || null);
      lastGeneratedAtRef.current = data?.generated_at || null;
    } catch {
      setError('Rapport kon niet geladen worden.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pollTokenRef.current++;
    loadData('latest');
  }, [reportType]);

  /* =====================================================
     GENERATE
  ===================================================== */

  const handleGenerate = async () => {
    setError('');
    setGenerating(true);
    setGenerateInfo(
      `AI is bezig met het genereren van het ${fallbackLabel.toLowerCase()}rapport…`
    );

    lastGeneratedAtRef.current = report?.generated_at || null;

    try {
      await current.generate();

      const updated = await pollUntilGeneratedAtChanges();

      if (updated) {
        setReport(updated);
        lastGeneratedAtRef.current = updated.generated_at;
      } else {
        setError('Rapport is niet op tijd beschikbaar gekomen.');
      }
    } catch {
      setError('Rapport genereren mislukt.');
    } finally {
      setGenerating(false);
    }
  };

  /* =====================================================
     DOWNLOAD
  ===================================================== */

  const handleDownload = async () => {
    try {
      setPdfLoading(true);
      const date =
        selectedDate === 'latest'
          ? dates?.[0] || report?.report_date
          : selectedDate;
      if (!date) return;
      await current.pdf(date);
    } finally {
      setPdfLoading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  const executiveSummary = renderJson(report?.executive_summary);

  return (
    <div className="max-w-screen-xl mx-auto pt-24 pb-10 px-4 space-y-8">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FileText />
          <h1 className="text-2xl font-semibold">
            Rapportage ({fallbackLabel})
          </h1>
        </div>
        {report?.report_date && (
          <span className="text-xs opacity-70">
            {report.report_date}
          </span>
        )}
      </header>

      <CardWrapper>
        <ReportTabs selected={reportType} onChange={setReportType} />
      </CardWrapper>

      <CardWrapper className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 rounded-xl border flex items-center gap-2"
        >
          {generating ? <Loader2 className="animate-spin" /> : <RefreshCw />}
          Genereer rapport
        </button>

        <button
          onClick={handleDownload}
          disabled={pdfLoading}
          className="px-4 py-2 rounded-xl bg-black text-white flex items-center gap-2"
        >
          <Download />
          {pdfLoading ? 'Downloaden…' : 'Download PDF'}
        </button>
      </CardWrapper>

      {generating && (
        <CardWrapper>
          <AILoader text={generateInfo} />
        </CardWrapper>
      )}

      {error && (
        <div className="bg-yellow-100 p-4 rounded-xl text-sm flex gap-2">
          <AlertTriangle />
          {error}
        </div>
      )}

      {noRealData && <DummyReportNew />}

      {!loading && report && (
        <ReportContainer>
          <ReportCard
            icon={<Brain />}
            title="Executive Summary"
            content={executiveSummary}
            full
          />
        </ReportContainer>
      )}
    </div>
  );
}

/* =====================================================
   HELPERS
===================================================== */

function DummyReportNew() {
  return (
    <ReportContainer>
      <ReportCard
        icon={<Brain />}
        title="Executive Summary"
        content={`Nog geen rapport gevonden.\n\nBESLISSING VANDAAG: OBSERVEREN\nCONFIDENCE: LAAG`}
        full
      />
    </ReportContainer>
  );
}
