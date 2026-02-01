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

import CardWrapper from '@/components/ui/CardWrapper';
import ReportGenerateOverlay from '@/components/ui/ReportGenerateOverlay';
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* =====================================================
   HELPERS
===================================================== */

function sortDatesDesc(list: string[]) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => (a < b ? 1 : -1));
}

function getReportSignature(report: any) {
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

  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('daily');
  const [report, setReport] = useState<any>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('latest');

  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateInfo, setGenerateInfo] = useState('');
  const [error, setError] = useState('');

  const pollTokenRef = useRef(0);
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
     LOAD (STABIEL)
===================================================== */

  const loadData = async (date: string = 'latest') => {
    setLoading(true);
    setError('');
    setSelectedDate(date);

    try {
      const rawDates = await current.getDates();
      setDates(sortDatesDesc(rawDates || []));

      const data =
        date === 'latest'
          ? await current.getLatest()
          : await current.getByDate(date);

      if (!data && AUTO_GENERATE_IF_EMPTY) {
        // 👇 BELANGRIJK: loader UIT, generate AAN
        setLoading(false);
        handleGenerate(true, date);
        return;
      }

      setReport(data || null);
      lastSignatureRef.current = getReportSignature(data);
    } catch {
      setError('Rapport kon niet geladen worden.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData('latest');
  }, [reportType]);

  /* =====================================================
     GENERATE (FULLSCREEN LOADER)
===================================================== */

  const pollUntilNewReport = async (preferDate = 'latest') => {
    pollTokenRef.current += 1;
    const token = pollTokenRef.current;

    let attempts = 0;

    while (attempts < POLL_MAX_ATTEMPTS) {
      if (pollTokenRef.current !== token) return;

      await sleep(POLL_INTERVAL_MS);

      const data =
        preferDate === 'latest'
          ? await current.getLatest()
          : await current.getByDate(preferDate);

      const sig = getReportSignature(data);

      if (sig && sig !== lastSignatureRef.current) {
        lastSignatureRef.current = sig;
        setReport(data);
        return;
      }

      attempts++;
    }

    throw new Error('Polling timeout');
  };

  const handleGenerate = async (fromAuto = false, preferDate = 'latest') => {
    setGenerating(true);
    setGenerateInfo(
      fromAuto
        ? `Nog geen ${fallbackLabel.toLowerCase()}rapport. AI is bezig…`
        : `AI genereert het ${fallbackLabel.toLowerCase()}rapport…`
    );

    try {
      await current.generate();
      await pollUntilNewReport(preferDate);
      showSnackbar(`${fallbackLabel}rapport is gereed`, 'success');
    } catch (err) {
      console.error(err);
      setError('Rapport genereren mislukt of duurde te lang.');
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
    <>
      {/* 🔥 FULLSCREEN GENERATE LOADER */}
      {generating && <ReportGenerateOverlay text={generateInfo} />}

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

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={selectedDate}
                onChange={(e) => loadData(e.target.value)}
                className="max-w-[160px]"
              >
                <option value="latest">Laatste</option>
                {dates.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <div className="flex-1" />

              <button
                onClick={handleDownload}
                disabled={pdfLoading}
                className="btn-secondary h-10"
              >
                {pdfLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                PDF
              </button>

              <button
                onClick={() => handleGenerate(false, selectedDate)}
                disabled={generating}
                className="btn-primary h-10"
              >
                <RefreshCw size={16} />
                Genereer rapport
              </button>
            </div>
          </div>
        </CardWrapper>

        {/* ERROR */}
        {error && (
          <div className="bg-yellow-50 border p-3 rounded-xl flex gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* REPORT */}
        {!loading && report && (
          <ReportContainer>
            <ReportLayout report={report} />
          </ReportContainer>
        )}
      </div>
    </>
  );
}
