'use client';

import WeeklyRegimeOverviewCard from '@/components/report/blocks/weekly/WeeklyRegimeOverviewCard';
import WeeklyScoreTrendCard from '@/components/report/blocks/weekly/WeeklyScoreTrendCard';
import WeeklyBotBehaviorCard from '@/components/report/blocks/weekly/WeeklyBotBehaviorCard';

import ReportSection from '@/components/report/sections/ReportSection';

/**
 * WeeklyReportLayout — v2.0
 * --------------------------------------------------
 * Structuur:
 * 1. Visuele samenvatting (cards)
 * 2. Score & gedrag (cards)
 * 3. Strategische context (tekst)
 *
 * Geen daily cards
 * Geen actie-focus
 * Wel: regime, gedrag, betrouwbaarheid
 */
export default function WeeklyReportLayout({ report }) {
  if (!report) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-14">

      {/* =====================================================
          1️⃣ WEEK SAMENVATTING — VISUEEL
      ====================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeeklyRegimeOverviewCard report={report} />
        <WeeklyScoreTrendCard report={report} />
      </section>

      {/* =====================================================
          2️⃣ BOTGEDRAG & EXECUTION
      ====================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeeklyBotBehaviorCard report={report} />

        {/* Lege slot voor toekomstige uitbreiding */}
        <div className="hidden md:block" />
      </section>

      {/* =====================================================
          3️⃣ STRATEGISCHE CONTEXT — LEESBAAR
      ====================================================== */}
      <section className="max-w-3xl mx-auto space-y-12">

        <ReportSection title="Weekoverzicht">
          <p className="leading-relaxed">
            {report.executive_summary || 'Geen weekoverzicht beschikbaar.'}
          </p>
        </ReportSection>

        <ReportSection title="Marktontwikkeling">
          <p className="leading-relaxed">
            {report.market_overview || 'Geen marktanalyse beschikbaar.'}
          </p>
        </ReportSection>

        <ReportSection title="Macro-context">
          <p className="leading-relaxed">
            {report.macro_trends || 'Geen macro-analyse beschikbaar.'}
          </p>
        </ReportSection>

        <ReportSection title="Technische structuur">
          <p className="leading-relaxed">
            {report.technical_structure || 'Geen technische analyse beschikbaar.'}
          </p>
        </ReportSection>

        <ReportSection title="Setups & strategische lessen">
          <p className="leading-relaxed">
            {report.strategic_lessons || 'Geen strategische lessen beschikbaar.'}
          </p>
        </ReportSection>

        <ReportSection title="Vooruitblik">
          <p className="leading-relaxed">
            {report.outlook || 'Geen vooruitblik beschikbaar.'}
          </p>
        </ReportSection>

      </section>

    </div>
  );
}
