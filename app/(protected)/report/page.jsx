'use client';

import { useState, useEffect, useMemo } from 'react';
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

const REPORT_TYPES = {
  daily: 'Dag',
  weekly: 'Week',
  monthly: 'Maand',
  quarterly: 'Kwartaal',
};

const AUTO_GENERATE_IF_EMPTY = true;

// ✅ Polling: langer wachten zodat UI niet “flasht” en je niet hoeft te refreshen
const POLL_INTERVAL_MS = 4000;
const POLL_MAX_ATTEMPTS = 60; // ~240s

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------------------------------------------
   ✅ JSONB helpers
   - DB velden zijn jsonb → kunnen object/array zijn
--------------------------------------------------- */
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
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (typeof value === 'object') return value;
  return null;
}

// ✅ kleine helper: sorteer datums desc (nieuwste eerst)
function sortDatesDesc(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => (a < b ? 1 : -1));
}

export default function ReportPage() {
  const [reportType, setReportType] = useState('daily');
  const [report, setReport] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  // ✅ Generation UX
  const [generating, setGenerating] = useState(false);
  const [generateInfo, setGenerateInfo] = useState('');

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

  // ✅ defensive fallback (no crash)
  const current = reportFns[reportType] || reportFns.daily;

  /* ---------------------------------------------------
     ✅ Key fix:
     - Na generatie: blijf pollen tot er echt data is
     - Zet selectedDate automatisch naar de “nieuwste” datum
     - Zet report meteen in state (geen refresh nodig)
  --------------------------------------------------- */
  const pollUntilReportExists = async ({ preferDate = 'latest' } = {}) => {
  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    try {
      // 1️⃣ History ophalen en sorteren (nieuwste eerst)
      const rawDates = await current.getDates();
      const dateList = sortDatesDesc(rawDates || []);
      setDates(dateList);

      // 2️⃣ Als user een specifieke datum wil → eerst die checken
      if (preferDate && preferDate !== 'latest') {
        try {
          const byDate = await current.getByDate(preferDate);
          if (byDate && Object.keys(byDate).length > 0) {
            return { data: byDate, dateList, forcedDate: preferDate };
          }
        } catch {}
      }

      // 3️⃣ Betrouwbaarste check: nieuwste datum expliciet ophalen
      if (dateList.length > 0) {
        const newest = dateList[0];
        try {
          const newestData = await current.getByDate(newest);
          if (newestData && Object.keys(newestData).length > 0) {
            return { data: newestData, dateList, forcedDate: newest };
          }
        } catch {}
      }

      // 4️⃣ Fallback: latest endpoint
      try {
        const latest = await current.getLatest();
        if (latest && Object.keys(latest).length > 0) {
          return {
            data: latest,
            dateList,
            forcedDate: latest?.report_date || null,
          };
        }
      } catch {}
    } catch (e) {
      console.error(e);
    }

    // ⏳ Loader blijft zichtbaar
    await sleep(POLL_INTERVAL_MS);
  }

  return { data: null, dateList: [] };
};

  const loadData = async (date = selectedDate) => {
    setLoading(true);
    setError('');
    setGenerateInfo('');
    setReport(null);

    // ✅ keep selectedDate in sync
    setSelectedDate(date || 'latest');

    try {
      const rawDates = await current.getDates();
      const dateList = sortDatesDesc(rawDates || []);
      setDates(dateList);

      let data =
        date === 'latest' || !date
          ? await current.getLatest()
          : await current.getByDate(date);

      // ✅ fallback: "latest" leeg maar history heeft items → pak newest expliciet
      if (
        (!data || Object.keys(data).length === 0) &&
        dateList.length > 0 &&
        (date === 'latest' || !date)
      ) {
        const newest = dateList[0];
        const newestData = await current.getByDate(newest);
        setSelectedDate(newest);
        setReport(newestData || null);
        return;
      }

      // ✅ autogen: start generatie + loader + polling (blijft aan tot report echt bestaat)
      if ((!data || Object.keys(data).length === 0) && AUTO_GENERATE_IF_EMPTY) {
        setGenerating(true);
        setGenerateInfo(
          `Nog geen ${fallbackLabel.toLowerCase()}rapport. AI is bezig met genereren…`
        );

        try {
          await current.generate();
        } catch (e) {
          console.error(e);
          setError('Rapport genereren mislukt.');
          setGenerating(false);
          return;
        }

        const res = await pollUntilReportExists({ preferDate: date });

        if (res?.forcedDate && res.forcedDate !== 'latest') {
          setSelectedDate(res.forcedDate);
        }

        if (res?.data && Object.keys(res.data).length > 0) {
          setReport(res.data);
          setGenerateInfo('');
        } else {
          setError('Rapport wordt nog verwerkt. Probeer het later opnieuw.');
        }

        setGenerating(false);
        return;
      }

      // ✅ normale load
      setReport(data || null);

      // ✅ als we “latest” laden maar report_date bestaat → UI syncen
      if ((date === 'latest' || !date) && data?.report_date) {
        setSelectedDate('latest'); // dropdown blijft “latest”
        // (we laten dropdown op latest staan, maar report is al zichtbaar)
      }
    } catch (err) {
      console.error(err);
      setError('Rapport kon niet geladen worden.');
    } finally {
      setLoading(false);
    }
  };

  // init/load on reportType change
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (cancelled) return;
      await loadData('latest');
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType]);

  const handleGenerate = async () => {
  setError('');
  setGenerateInfo(
    `AI is bezig met het genereren van het ${fallbackLabel.toLowerCase()}rapport…`
  );

  // 🔥 Loader START
  setGenerating(true);

  try {
    // 1️⃣ Start Celery task (ASYNC)
    await current.generate();

    // 2️⃣ Blijf pollen tot rapport ECHT bestaat
    const res = await pollUntilReportExists({
      preferDate: selectedDate,
    });

    // 3️⃣ UI synchroniseren met echte datum
    if (res?.forcedDate && res.forcedDate !== 'latest') {
      setSelectedDate(res.forcedDate);
    }

    // 4️⃣ Rapport DIRECT tonen (geen refresh nodig)
    if (res?.data && Object.keys(res.data).length > 0) {
      setReport(res.data);
      setGenerateInfo('');
    } else {
      setError('Rapport wordt nog verwerkt. Probeer het later opnieuw.');
    }
  } catch (e) {
    console.error(e);
    setError('Rapport genereren mislukt.');
  } finally {
    // 🔥 Loader stopt PAS HIER (na polling)
    setGenerating(false);
  }
};

  const handleDownload = async () => {
    try {
      setPdfLoading(true);

      // ✅ safe date pick
      const date =
        selectedDate === 'latest'
          ? dates?.[0] || report?.report_date
          : selectedDate;

      if (!date) return;
      await current.pdf(date);
    } catch {
      alert('Download mislukt.');
    } finally {
      setPdfLoading(false);
    }
  };

  // ✅ Nieuw schema: direct uit DB (jsonb-friendly)
  const executiveSummary = renderJson(report?.executive_summary || '');

  return (
    <div className="max-w-screen-xl mx-auto pt-24 pb-10 px-4 space-y-8 bg-[var(--bg)] text-[var(--text-dark)] animate-fade-slide">
      {/* HEADER */}
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

      {/* TABS + FILTER BAR */}
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
                disabled={generating}
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
              disabled={pdfLoading || generating}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium shadow-sm
                ${
                  pdfLoading || generating
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
              disabled={generating}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm border border-[var(--border)]
                ${generating ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[var(--primary-light)]'}
              `}
            >
              {generating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {generating ? 'Genereren…' : 'Genereer rapport'}
            </button>
          </div>
        </div>
      </CardWrapper>

      {/* AI GENERATING LOADER */}
      {generating && (
        <CardWrapper>
          <AILoader
            size="md"
            variant="dots"
            text={generateInfo || 'AI is bezig…'}
          />
        </CardWrapper>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
          <AlertTriangle size={16} />
          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && !generating && (
        <div className="flex items-center gap-2 text-sm text-[var(--text-light)]">
          <Loader2 size={16} className="animate-spin" />
          Rapport laden…
        </div>
      )}

      {/* DUMMY REPORT */}
      {noRealData && <DummyReportNew />}

      {/* REAL REPORT */}
      {!loading && !generating && report && Object.keys(report).length > 0 && (
        <ReportContainer>
          <ReportCard
            icon={<Brain size={18} />}
            title="Executive Summary"
            content={executiveSummary || '–'}
            full
            color="blue"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              content={renderJson(report.macro_context) || '–'}
              pre
              color="gray"
            />

            <ReportCard
              icon={<ListChecks size={18} />}
              title="Setup Validatie"
              content={renderJson(report.setup_validation) || '–'}
              pre
              color="green"
            />

            <ReportCard
              icon={<Target size={18} />}
              title="Strategie Implicatie"
              content={renderJson(report.strategy_implication) || '–'}
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
              content={renderJson(report.outlook) || '–'}
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
   Helpers (new DB schema)
--------------------------------------------------- */

function formatMarketSnapshot(report) {
  const price = report?.price ?? '–';
  const ch24 = report?.change_24h ?? '–';
  const vol = report?.volume ?? '–';

  const macro = report?.macro_score ?? '–';
  const tech = report?.technical_score ?? '–';
  const market = report?.market_score ?? '–';
  const setup = report?.setup_score ?? '–';

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
  // jsonb kan al array zijn, of stringified json (legacy)
  const raw = report?.indicator_highlights;

  const inds = parseJsonMaybe(raw);
  if (!inds) return 'Geen indicator-highlights gevonden.';
  if (!Array.isArray(inds) || inds.length === 0)
    return 'Geen indicator-highlights gevonden.';

  return inds
    .slice(0, 5)
    .map((i) => {
      const name = i?.indicator ?? i?.name ?? '–';
      const score = i?.score ?? '–';
      const interp = i?.interpretation ?? i?.advies ?? '–';
      return `- ${name}: score ${score} → ${interp}`;
    })
    .join('\n');
}

/* ---------------------------------------------------
   Dummy report (new structure)
--------------------------------------------------- */

function DummyReportNew() {
  return (
    <ReportContainer>
      <ReportCard
        icon={<Brain size={18} />}
        title="Executive Summary"
        content={`Nog geen rapport gevonden.\n\nBESLISSING VANDAAG: OBSERVEREN\nCONFIDENCE: LAAG`}
        full
        color="blue"
      />
    </ReportContainer>
  );
}
