'use client';

import ReportSection from '@/components/report/sections/ReportSection';

/**
 * QuarterlyReportLayout
 * --------------------------------------------------
 * Doel:
 * - Evaluatie van het afgelopen kwartaal
 * - Betrouwbaarheid van strategie, bots en setups
 * - Risico & robuustheid
 * - Beslisbasis voor structurele aanpassingen
 *
 * Backend canonical keys (quarterly_reports):
 * - executive_summary
 * - market_overview
 * - macro_trends
 * - technical_structure
 * - setup_performance
 * - bot_performance
 * - strategic_lessons
 * - outlook
 */
export default function QuarterlyReportLayout({ report }) {
  if (!report) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-16">

      {/* KWARTAALOVERZICHT */}
      <ReportSection title="Kwartaaloverzicht">
        <p className="leading-relaxed">
          {report.executive_summary || 'Geen kwartaaloverzicht beschikbaar.'}
        </p>
      </ReportSection>

      {/* MARKTREGIME & CONTEXT */}
      <ReportSection title="Marktregime en context">
        <p className="leading-relaxed">
          {report.market_overview || 'Geen marktregime-analyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* MACRO CYCLUS */}
      <ReportSection title="Macrocyclus en positionering">
        <p className="leading-relaxed">
          {report.macro_trends || 'Geen macrocyclus-analyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* TECHNISCHE STRUCTUUR */}
      <ReportSection title="Technische structuur en trendkwaliteit">
        <p className="leading-relaxed">
          {report.technical_structure || 'Geen technische trendbeoordeling beschikbaar.'}
        </p>
      </ReportSection>

      {/* SETUPS / EDGE */}
      <ReportSection title="Setups en edge-evaluatie">
        <p className="leading-relaxed">
          {report.setup_performance || 'Geen setup-evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* BOT & EXECUTION */}
      <ReportSection title="Bot- en execution review">
        <p className="leading-relaxed">
          {report.bot_performance || 'Geen bot- of execution review beschikbaar.'}
        </p>
      </ReportSection>

      {/* RISICO & LESSEN */}
      <ReportSection title="Risico en strategische lessen">
        <p className="leading-relaxed">
          {report.strategic_lessons || 'Geen risico- of discipline-evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* VOORUITBLIK */}
      <ReportSection title="Vooruitblik volgend kwartaal">
        <p className="leading-relaxed">
          {report.outlook || 'Geen vooruitblik beschikbaar.'}
        </p>
      </ReportSection>

    </div>
  );
}
