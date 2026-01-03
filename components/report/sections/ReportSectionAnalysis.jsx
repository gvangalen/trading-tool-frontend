import NarrativeBlock from '../blocks/NarrativeBlock';
import DataListBlock from '../blocks/DataListBlock';

/*
=====================================================
 SECTION: ANALYSIS
 - Waarom staat de markt hier?
 - Wat zegt data (macro / technical / setup)?
 - Tekst ↔ indicator-cards in afwisselend grid
=====================================================
*/

export default function ReportSectionAnalysis({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-12">

      {/* =========================
         1️⃣ MACRO ANALYSE
         Tekst links — Card rechts
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tekst */}
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Macro Context"
            field="macro_context"
            report={report}
          />
        </div>

        {/* Card */}
        <div className="md:col-span-1">
          <DataListBlock
            report={report}
            field="macro_indicator_highlights"
            title="Macro Indicator Highlights"
          />
        </div>
      </div>

      {/* =========================
         2️⃣ TECHNISCHE ANALYSE
         Card links — Tekst rechts (afwisseling)
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card */}
        <div className="md:col-span-1 md:order-1">
          <DataListBlock
            report={report}
            field="technical_indicator_highlights"
            title="Technical Indicator Highlights"
          />
        </div>

        {/* Tekst */}
        <div className="md:col-span-2 md:order-2">
          <NarrativeBlock
            title="Technische Analyse"
            field="technical_analysis"
            report={report}
          />
        </div>
      </div>

      {/* =========================
         3️⃣ SETUP VALIDATIE
         Tekst links — Card rechts
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tekst */}
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Setup Validatie"
            field="setup_validation"
            report={report}
          />
        </div>

        {/* Card */}
        <div className="md:col-span-1">
          <DataListBlock
            report={report}
            field="setup_indicator_highlights"
            title="Setup Indicator Highlights"
          />
        </div>
      </div>

    </div>
  );
}
