import NarrativeBlock from '../blocks/NarrativeBlock';
import DataListBlock from '../blocks/DataListBlock';

/*
=====================================================
 SECTION: ANALYSIS
 - Waarom staat de markt hier?
 - Wat zegt data (macro / technical / setup)?
 - Tekst links, indicator-cards rechts
=====================================================
*/

export default function ReportSectionAnalysis({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-12">

      {/* =========================
         1️⃣ MACRO ANALYSE
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
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tekst */}
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Technische Analyse"
            field="technical_analysis"
            report={report}
          />
        </div>

        {/* Card */}
        <div className="md:col-span-1">
          <DataListBlock
            report={report}
            field="technical_indicator_highlights"
            title="Technical Indicator Highlights"
          />
        </div>
      </div>

      {/* =========================
         3️⃣ SETUP VALIDATIE
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
