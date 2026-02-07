'use client';

import SummaryBlock from '@/components/report/blocks/SummaryBlock';
import NarrativeBlock from '@/components/report/blocks/NarrativeBlock';
import ScoreBarBlock from '@/components/report/blocks/ScoreBarBlock';
import SetupMatchReportCard from '@/components/report/blocks/SetupMatchReportCard';
import BotDecisionReportCard from '@/components/report/blocks/BotDecisionReportCard';

/**
 * WeeklyReportLayout
 * --------------------------------------------------
 * Filosofie:
 * - Rustige, reflectieve weekbeschouwing
 * - Context > actie
 * - Evaluatie van markt, setups en botgedrag
 * - Geen dagfocus, geen intraday-prikkels
 *
 * Backend canonical keys (weekly_reports):
 * - executive_summary
 * - market_overview
 * - macro_trends
 * - technical_structure
 * - setup_performance
 * - bot_performance
 * - strategic_lessons
 * - outlook
 */
export default function WeeklyReportLayout({ report }) {
  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-20">

      {/* ======================================================
       * 1. WEEKOVERZICHT — ANKER
       * ====================================================== */}
      <SummaryBlock
        title="Weekoverzicht"
        content={report.executive_summary}
        fallback="Geen weekoverzicht beschikbaar."
      />

      {/* ======================================================
       * 2. MARKT & CONTEXT
       * ====================================================== */}
      <div className="space-y-14">
        <NarrativeBlock
          title="Marktontwikkeling"
          content={report.market_overview}
          fallback="Geen marktanalyse beschikbaar."
        />

        <NarrativeBlock
          title="Macro-context"
          content={report.macro_trends}
          fallback="Geen macro-analyse beschikbaar."
        />

        <NarrativeBlock
          title="Technische structuur"
          content={report.technical_structure}
          fallback="Geen technische analyse beschikbaar."
        />
      </div>

      {/* ======================================================
       * 3. SCORES — COMPACTE SAMENVATTING
       * ====================================================== */}
      <ScoreBarBlock
        macroScore={report.macro_score}
        technicalScore={report.technical_score}
        setupScore={report.setup_score}
      />

      {/* ======================================================
       * 4. SETUPS & BOTGEDRAG — EVALUATIE
       * ====================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SetupMatchReportCard
          title="Setup-evaluatie"
          description={report.setup_performance}
        />

        <BotDecisionReportCard
          title="Bot- en trade-evaluatie"
          description={report.bot_performance}
        />
      </div>

      {/* ======================================================
       * 5. LESSEN & VOORUITBLIK
       * ====================================================== */}
      <div className="space-y-14">
        <NarrativeBlock
          title="Strategische lessen & risico"
          content={report.strategic_lessons}
          fallback="Geen strategische lessen beschikbaar."
        />

        <NarrativeBlock
          title="Vooruitblik"
          content={report.outlook}
          fallback="Geen vooruitblik beschikbaar."
        />
      </div>

    </div>
  );
}
