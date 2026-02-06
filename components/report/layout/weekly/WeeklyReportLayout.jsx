'use client';

import ReportSection from '@/components/report/sections/ReportSection';

/**
 * WeeklyReportLayout
 * --------------------------------------------------
 * Doel:
 * - Rustige, langetermijn beschouwing
 * - Samenvatting van dagelijkse signalen
 * - Geen actie-dagfocus, wel context & regime
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
    <div className="max-w-3xl mx-auto space-y-12">

      {/* WEEKOVERZICHT */}
      <ReportSection title="Weekoverzicht">
        <p className="leading-relaxed">
          {report.executive_summary || 'Geen weekoverzicht beschikbaar.'}
        </p>
      </ReportSection>

      {/* MARKT */}
      <ReportSection title="Marktontwikkeling">
        <p className="leading-relaxed">
          {report.market_overview || 'Geen marktanalyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* MACRO */}
      <ReportSection title="Macro-context">
        <p className="leading-relaxed">
          {report.macro_trends || 'Geen macro-analyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* TECHNISCH */}
      <ReportSection title="Technische structuur">
        <p className="leading-relaxed">
          {report.technical_structure || 'Geen technische analyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* SETUPS / STRATEGIE */}
      <ReportSection title="Setups en strategie">
        <p className="leading-relaxed">
          {report.setup_performance || 'Geen setup-evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* BOT EVALUATIE */}
      <ReportSection title="Bot- en trade-evaluatie">
        <p className="leading-relaxed">
          {report.bot_performance || 'Geen bot-evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* RISICO / LESSEN */}
      <ReportSection title="Risico & strategische lessen">
        <p className="leading-relaxed">
          {report.strategic_lessons || 'Geen risico-evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* VOORUITBLIK */}
      <ReportSection title="Vooruitblik">
        <p className="leading-relaxed">
          {report.outlook || 'Geen vooruitblik beschikbaar.'}
        </p>
      </ReportSection>

    </div>
  );
}
