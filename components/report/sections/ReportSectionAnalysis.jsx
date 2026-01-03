import NarrativeBlock from "../blocks/NarrativeBlock";
import DataListBlock from "../blocks/DataListBlock";
import SetupMatchCard from "../blocks/SetupMatchReportCard";
import ActiveStrategyReportCard from "../blocks/ActiveStrategyReportCard";

/*
=====================================================
 SECTION: ANALYSIS
 - Middenstuk van het rapport
 - Verhaal + bewijs uit data
 - Afwisselend: tekst ↔ cards
=====================================================
*/

export default function ReportSectionAnalysis({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-12">

      {/* =================================================
          1️⃣ MARKET ANALYSE
          Tekst links — Card rechts
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Market Analyse"
            field="market_analysis"
            report={report}
          />
        </div>

        <div className="md:col-span-1">
          <DataListBlock
            report={report}
            field="market_indicator_highlights"
            title="Market Indicator Highlights"
          />
        </div>
      </div>

      {/* =================================================
          2️⃣ MACRO ANALYSE
          Card links — Tekst rechts
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 md:order-1">
          <DataListBlock
            report={report}
            field="macro_indicator_highlights"
            title="Macro Indicator Highlights"
          />
        </div>

        <div className="md:col-span-2 md:order-2">
          <NarrativeBlock
            title="Macro Context"
            field="macro_context"
            report={report}
          />
        </div>
      </div>

      {/* =================================================
          3️⃣ TECHNISCHE ANALYSE
          Tekst links — Card rechts
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Technische Analyse"
            field="technical_analysis"
            report={report}
          />
        </div>

        <div className="md:col-span-1">
          <DataListBlock
            report={report}
            field="technical_indicator_highlights"
            title="Technical Indicator Highlights"
          />
        </div>
      </div>

      {/* =================================================
          4️⃣ SETUP VALIDATIE
          Card links — Tekst rechts
          (SPECIAL CARD)
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 md:order-1">
          <SetupMatchCard report={report} />
        </div>

        <div className="md:col-span-2 md:order-2">
          <NarrativeBlock
            title="Setup Validatie"
            field="setup_validation"
            report={report}
          />
        </div>
      </div>

      {/* =================================================
          5️⃣ STRATEGIE
          Tekst links — Card rechts
          (SPECIAL CARD)
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Strategie Implicatie"
            field="strategy_implication"
            report={report}
          />
        </div>

        <div className="md:col-span-1">
          <ActiveStrategyReportCard report={report} />
        </div>
      </div>

    </div>
  );
}
