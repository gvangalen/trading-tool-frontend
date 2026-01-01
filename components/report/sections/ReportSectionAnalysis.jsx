import NarrativeBlock from '../blocks/NarrativeBlock';
import DataListBlock from '../blocks/DataListBlock';

/* =====================================================
   SECTION: ANALYSIS
   - Waarom staat dit hier?
   - Verdieping na snapshot & scores
   - Uitleg *waarom* de markt zo is
===================================================== */

export default function ReportSectionAnalysis({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-4">
      {/* MACRO CONTEXT — waarom deze marktomgeving? */}
      <NarrativeBlock
        title="Macro Context"
        text={report.macro_context}
        color="gray"
      />

      {/* SETUP VALIDATIE — wat zegt dit over setups? */}
      <NarrativeBlock
        title="Setup Validatie"
        text={report.setup_validation}
        color="green"
      />

      {/* INDICATOR HIGHLIGHTS — bewijs uit data */}
      <DataListBlock
        title="Indicator Highlights"
        items={report.indicator_highlights}
      />
    </div>
  );
}
