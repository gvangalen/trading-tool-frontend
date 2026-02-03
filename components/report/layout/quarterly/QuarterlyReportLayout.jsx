'use client';

import ReportSection from '@/components/report/sections/ReportSection';

/**
 * QuarterlyReportLayout
 * --------------------------------------------------
 * Doel:
 * - Evaluatie van het afgelopen kwartaal
 * - Betrouwbaarheid van strategie, bots en setups
 * - Risico & drawdown context
 * - Beslisbasis voor aanpassingen in aanpak
 *
 * Verwachte report keys (quarterly agent):
 * - executive_summary
 * - market_regime_review
 * - macro_cycle_position
 * - technical_trend_quality
 * - setup_edge_evaluation
 * - bot_and_execution_review
 * - risk_and_drawdown
 * - strategy_adjustments
 * - outlook_next_quarter
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

      {/* MARKTREGIME REVIEW */}
      <ReportSection title="Marktregime en context">
        <p className="leading-relaxed">
          {report.market_regime_review || 'Geen analyse van het marktregime beschikbaar.'}
        </p>
      </ReportSection>

      {/* MACRO CYCLUS */}
      <ReportSection title="Macrocyclus en positionering">
        <p className="leading-relaxed">
          {report.macro_cycle_position || 'Geen macrocyclus-analyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* TECHNISCHE TRENDKWALITEIT */}
      <ReportSection title="Technische trendkwaliteit">
        <p className="leading-relaxed">
          {report.technical_trend_quality || 'Geen technische trendbeoordeling beschikbaar.'}
        </p>
      </ReportSection>

      {/* SETUP EDGE */}
      <ReportSection title="Setup-edge en signalen">
        <p className="leading-relaxed">
          {report.setup_edge_evaluation || 'Geen setup-evaluatie beschikbaar.'}
        </p>
      </ReportSection>

      {/* BOT & EXECUTION */}
      <ReportSection title="Bot- en execution review">
        <p className="leading-relaxed">
          {report.bot_and_execution_review || 'Geen bot- of execution review beschikbaar.'}
        </p>
      </ReportSection>

      {/* RISICO & DRAWDOWN */}
      <ReportSection title="Risico en drawdown">
        <p className="leading-relaxed">
          {report.risk_and_drawdown || 'Geen risico- en drawdownanalyse beschikbaar.'}
        </p>
      </ReportSection>

      {/* STRATEGIE AANPASSINGEN */}
      <ReportSection title="Strategische aanpassingen">
        <p className="leading-relaxed">
          {report.strategy_adjustments || 'Geen strategische aanpassingen voorgesteld.'}
        </p>
      </ReportSection>

      {/* VOORUITBLIK */}
      <ReportSection title="Vooruitblik volgend kwartaal">
        <p className="leading-relaxed">
          {report.outlook_next_quarter || 'Geen vooruitblik beschikbaar.'}
        </p>
      </ReportSection>

    </div>
  );
}
