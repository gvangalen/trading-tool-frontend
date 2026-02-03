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
 * Verwacht report keys (weekly agent):
 * - executive_summary
 * - market_review
 * - macro_review
 * - technical_review
 * - setup_review
 * - bot_review
 * - risk_review
 * - outlook
 */
export default function WeeklyReportLayout({ report }) {
  if (!report) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-12">

      {/* WEEK SAMENVATTING */}
      <ReportSection title="Weekoverzicht">
        <p className="leading-relaxed">
          {report.executive_summary || 'Geen weekoverzicht beschikbaar.'}
        </p>
      </ReportSection>

      {/* MARKT */}
      <ReportSection title="Marktontwikkeling">
        <p className="leading-relaxed">
          {report.market_review || 'Geen marktanalyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* MACRO */}
      <ReportSection title="Macro-context">
        <p className="leading-relaxed">
          {report.macro_review || 'Geen macro-analyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* TECHNISCH */}
      <ReportSection title="Technische structuur">
        <p className="leading-relaxed">
          {report.technical_review || 'Geen technische analyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* SETUPS / STRATEGIE */}
      <ReportSection title="Setups en strategie">
        <p className="leading-relaxed">
          {report.setup_review || 'Geen setup-evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* BOT EVALUATIE */}
      <ReportSection title="Bot- en trade-evaluatie">
        <p className="leading-relaxed">
          {report.bot_review || 'Geen bot-evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* RISICO */}
      <ReportSection title="Risico & discipline">
        <p className="leading-relaxed">
          {report.risk_review || 'Geen risico-evaluatie beschikbaar.'}
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
