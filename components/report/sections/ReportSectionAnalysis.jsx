import NarrativeBlock from "../blocks/NarrativeBlock";
import DataListBlock from "../blocks/DataListBlock";
import SetupMatchCard from "../blocks/SetupMatchReportCard";
import ActiveStrategyReportCard from "../blocks/ActiveStrategyReportCard";
import SectionAlignedAside from "../layout/SectionAlignedAside";

// ✅ REPORT-SPECIFIEKE BOT CARD (snapshot only)
import BotDecisionReportCard from "../blocks/BotDecisionReportCard";

/*
=====================================================
 SECTION: ANALYSIS
 - Middenstuk van het rapport
 - Verhaal + bewijs uit data
 - Tekst en cards delen layout, niet inhoud
=====================================================
*/

export default function ReportSectionAnalysis({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-16">

      {/* =================================================
          1️⃣ MARKET ANALYSE
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Market Analyse"
            field="market_analysis"
            report={report}
          />
        </div>

        <SectionAlignedAside>
          <DataListBlock
            report={report}
            field="market_indicator_highlights"
            title="Market Indicator Highlights"
          />
        </SectionAlignedAside>
      </div>

      {/* =================================================
          2️⃣ MACRO ANALYSE
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <SectionAlignedAside>
          <DataListBlock
            report={report}
            field="macro_indicator_highlights"
            title="Macro Indicator Highlights"
          />
        </SectionAlignedAside>

        <div className="md:col-span-2">
          <NarrativeBlock
            title="Macro Context"
            field="macro_context"
            report={report}
          />
        </div>
      </div>

      {/* =================================================
          3️⃣ TECHNISCHE ANALYSE
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Technische Analyse"
            field="technical_analysis"
            report={report}
          />
        </div>

        <SectionAlignedAside>
          <DataListBlock
            report={report}
            field="technical_indicator_highlights"
            title="Technical Indicator Highlights"
          />
        </SectionAlignedAside>
      </div>

      {/* =================================================
          4️⃣ SETUP VALIDATIE
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Setup Validatie"
            field="setup_validation"
            report={report}
          />
        </div>

        <SectionAlignedAside>
          <SetupMatchCard report={report} />
        </SectionAlignedAside>
      </div>

      {/* =================================================
          5️⃣ STRATEGIE
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Strategie Implicatie"
            field="strategy_implication"
            report={report}
          />
        </div>

        <SectionAlignedAside>
          <ActiveStrategyReportCard report={report} />
        </SectionAlignedAside>
      </div>

      {/* =================================================
          6️⃣ BOTBESLISSING
          🔹 Links: uitleg report agent
          🔹 Rechts: FEITELIJKE bot snapshot (report-only)
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Botbeslissing"
            field="bot_strategy"
            report={report}
          />
        </div>

        <SectionAlignedAside>
          <BotDecisionReportCard snapshot={report?.bot_snapshot} />
        </SectionAlignedAside>
      </div>

    </div>
  );
}
