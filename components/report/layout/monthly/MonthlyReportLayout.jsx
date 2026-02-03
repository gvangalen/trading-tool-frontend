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
 * Verwachte report keys (monthly agent):
 * - executive_summary
 * - market_regime
 * - macro_environment
 * - technical_structure
 * - setup_performance
 * - bot_performance
 * - risk_assessment
 * - forward_view
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

      {/* MARKTREGIME */}
      <ReportSection title="Marktregime">
        <p className="leading-relaxed">
          {report.market_regime || 'Geen beschrijving van het marktregime beschikbaar.'}
        </p>
      </ReportSection>

      {/* MACRO */}
      <ReportSection title="Macro-omgeving">
        <p className="leading-relaxed">
          {report.macro_environment || 'Geen macro-analyse beschikbaar.'}
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

      {/* RISICO */}
      <ReportSection title="Risico en robuustheid">
        <p className="leading-relaxed">
          {report.risk_assessment || 'Geen risicoanalyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* VOORUITBLIK */}
      <ReportSection title="Vooruitblik">
        <p className="leading-relaxed">
          {report.forward_view || 'Geen vooruitblik beschikbaar.'}
        </p>
      </ReportSection>

    </div>
  );
}
