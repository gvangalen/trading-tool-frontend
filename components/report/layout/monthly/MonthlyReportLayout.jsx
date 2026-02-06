'use client';

import ReportSection from '@/components/report/sections/ReportSection';

/**
 * MonthlyReportLayout
 * --------------------------------------------------
 * Doel:
 * - Strategisch overzicht van de maand
 * - Verandering in marktregime
 * - Betrouwbaarheid van signalen & bots
 * - Positionering richting komende maand(en)
 *
 * Backend canonical keys (monthly_reports):
 * - executive_summary
 * - market_overview
 * - macro_trends
 * - technical_structure
 * - setup_performance
 * - bot_performance
 * - strategic_lessons
 * - outlook
 */
export default function MonthlyReportLayout({ report }) {
  if (!report) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-14">

      {/* MAANDOVERZICHT */}
      <ReportSection title="Maandoverzicht">
        <p className="leading-relaxed">
          {report.executive_summary || 'Geen maandoverzicht beschikbaar.'}
        </p>
      </ReportSection>

      {/* MARKTREGIME / MARKT */}
      <ReportSection title="Marktregime en prijsstructuur">
        <p className="leading-relaxed">
          {report.market_overview || 'Geen marktregime-analyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* MACRO */}
      <ReportSection title="Macro-omgeving">
        <p className="leading-relaxed">
          {report.macro_trends || 'Geen macro-analyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* TECHNISCHE STRUCTUUR */}
      <ReportSection title="Technische structuur">
        <p className="leading-relaxed">
          {report.technical_structure || 'Geen technische evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* SETUPS */}
      <ReportSection title="Setups en signalen">
        <p className="leading-relaxed">
          {report.setup_performance || 'Geen setup-evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* BOT PERFORMANCE */}
      <ReportSection title="Bot- en tradeperformance">
        <p className="leading-relaxed">
          {report.bot_performance || 'Geen botperformance beschikbaar.'}
        </p>
      </ReportSection>

      {/* RISICO / LESSEN */}
      <ReportSection title="Risico en strategische lessen">
        <p className="leading-relaxed">
          {report.strategic_lessons || 'Geen risico-analyse beschikbaar.'}
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
