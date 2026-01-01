'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  fetchDailyReportLatest,
  fetchDailyReportByDate,
  fetchDailyReportDates,
  generateDailyReport,
  fetchDailyReportPDF,
  fetchWeeklyReportLatest,
  fetchWeeklyReportByDate,
  fetchWeeklyReportDates,
  generateWeeklyReport,
  fetchWeeklyReportPDF,
  fetchMonthlyReportLatest,
  fetchMonthlyReportByDate,
  fetchMonthlyReportDates,
  generateMonthlyReport,
  fetchMonthlyReportPDF,
  fetchQuarterlyReportLatest,
  fetchQuarterlyReportByDate,
  fetchQuarterlyReportDates,
  generateQuarterlyReport,
  fetchQuarterlyReportPDF,
} from '@/lib/api/report';

import ReportTabs from '@/components/report/ReportTabs';
import ReportContainer from '@/components/report/layout/ReportContainer';
import ReportLayout from '@/components/report/layout/ReportLayout';

import ReportSectionMarket from '@/components/report/sections/ReportSectionMarket';
import ReportSectionAnalysis from '@/components/report/sections/ReportSectionAnalysis';
import ReportSectionStrategy from '@/components/report/sections/ReportSectionStrategy';

import CardWrapper from '@/components/ui/CardWrapper';
import AILoader from '@/components/ui/AILoader';
import { useModal } from '@/components/modal/ModalProvider';

import {
  FileText,
  CalendarRange,
  Download,
  RefreshCw,
  AlertTriangle,
  Loader2,
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
   HELPERS
===================================================== */

function sortDatesDesc(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => (a < b ? 1 : -1));
}

function getReportSignature(report) {
  if (!report) return '';
  return (
    report.generated_at ||
    report.updated_at ||
    report.created_at ||
    JSON.stringify(report)
  );
}

/* =====================================================
   PAGE
===================================================== */

export default function ReportPage() {
  const { showSnackbar } = useModal();

  const [reportType, setReportType] = useState('daily');
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');

  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateInfo, setGenerateInfo] = useState('');
  const [error, setError] = useState('');

  const pollTokenRef = useRef(0);
  const loadTokenRef = useRef(0);
  const lastSignatureRef = useRef('');

  const fallbackLabel = REPORT_TYPES[reportType] || 'Rapport';

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
     POLLING
===================================================== */

  const pollUntilReportChanges = async (preferDate = 'latest') => {
    const myToken = ++pollTokenRef.current;
    const previousSignature = lastSignatureRef.current;

    for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
      if (pollTokenRef.current !== myToken) return null;

      const rawDates = await current.getDates();
      const sorted = sortDatesDesc(rawDates || []);
      setDates(sorted);

      const dateToCheck =
        preferDate !== 'latest'
          ? preferDate
          : sorted[0];

      if (!dateToCheck) continue;

      const data = await current.getByDate(dateToCheck);
      const sig = getReportSignature(data);

      if (sig && sig !== previousSignature) {
        return { data, forcedDate: dateToCheck };
      }

      await sleep(POLL_INTERVAL_MS);
    }

    return null;
  };

  /* =====================================================
     LOAD
===================================================== */

  const loadData = async (date = 'latest') => {
    const token = ++loadTokenRef.current;
    setLoading(true);
    setError('');
    setSelectedDate(date);

    try {
      const rawDates = await current.getDates();
      if (loadTokenRef.current !== token) return;

      const sorted = sortDatesDesc(rawDates || []);
      setDates(sorted);

      let data =
        date === 'latest'
          ? await current.getLatest()
          : await current.getByDate(date);

      if (!data && AUTO_GENERATE_IF_EMPTY) {
        await handleGenerate(true, date);
        return;
      }

      setReport(data || null);
      lastSignatureRef.current = getReportSignature(data);
    } catch {
      setError('Rapport kon niet geladen worden.');
    } finally {
      if (loadTokenRef.current === token) setLoading(false);
    }
  };

  useEffect(() => {
    pollTokenRef.current++;
    loadTokenRef.current++;
    loadData('latest');
  }, [reportType]);

  /* =====================================================
     GENERATE
===================================================== */

  const handleGenerate = async (fromAuto = false, preferDate = 'latest') => {
    setGenerating(true);
    setGenerateInfo(
      fromAuto
        ? `Nog geen ${fallbackLabel.toLowerCase()}rapport. AI is bezig…`
        : `AI genereert het ${fallbackLabel.toLowerCase()}rapport…`
    );

    lastSignatureRef.current = getReportSignature(report);

    try {
      await current.generate();
      const res = await pollUntilReportChanges(preferDate);

      if (res?.data) {
        setReport(res.data);
        setSelectedDate(res.forcedDate);
        showSnackbar(`${fallbackLabel}rapport is gereed`, 'success');
      } else {
        setError('Rapport wordt nog verwerkt.');
      }
    } catch {
      setError('Rapport genereren mislukt.');
    } finally {
      setGenerating(false);
    }
  };

  /* =====================================================
     PDF
===================================================== */

  const handleDownload = async () => {
    try {
      setPdfLoading(true);
      const date =
        selectedDate === 'latest'
          ? dates[0]
          : selectedDate;

      if (date) await current.pdf(date);
    } finally {
      setPdfLoading(false);
    }
  };

  /* =====================================================
     RENDER
===================================================== */

  return (
    <div className="max-w-screen-xl mx-auto pt-24 pb-10 px-4 space-y-8">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary-light)] rounded-xl flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">
              Rapportage ({fallbackLabel})
            </h1>
            <p className="text-sm text-[var(--text-light)]">
              AI-gegenereerde markt- en tradingrapporten
            </p>
          </div>
        </div>

        {report?.report_date && (
          <div className="text-xs bg-[var(--bg-soft)] px-3 py-1 rounded-full flex items-center gap-2">
            <CalendarRange size={14} />
            {report.report_date}
          </div>
        )}
      </header>

      {/* CONTROLS */}
      <CardWrapper>
        <div className="space-y-4">
          <ReportTabs selected={reportType} onChange={setReportType} />

          <div className="flex items-center gap-3">
            <select
              value={selectedDate}
              onChange={(e) => loadData(e.target.value)}
              className="px-3 py-2 rounded-xl border"
            >
              <option value="latest">Laatste</option>
              {dates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <div className="flex-1" />

            <button onClick={handleDownload} disabled={pdfLoading}>
              {pdfLoading ? <Loader2 className="animate-spin" /> : <Download />}
            </button>

            <button onClick={() => handleGenerate(false, selectedDate)}>
              <RefreshCw /> Genereer
            </button>
          </div>
        </div>
      </CardWrapper>

      {generating && (
        <CardWrapper>
          <AILoader text={generateInfo} />
        </CardWrapper>
      )}

      {error && (
        <div className="bg-yellow-50 border p-3 rounded-xl flex gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {!loading && report && (
        <ReportContainer>
          <ReportLayout report={report} />
        </ReportContainer>
      )}
    </div>
  );
}
