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
        field="macro_context"
        report={report}
        color="gray"
      />

      {/* SETUP VALIDATIE — wat zegt dit over setups? */}
      <NarrativeBlock
        title="Setup Validatie"
        field="setup_validation"
        report={report}
        color="green"
      />

      {/* INDICATOR HIGHLIGHTS — bewijs uit data */}
      <DataListBlock
        report={report}
        title="Indicator Highlights"
        color="gray"
      />
    </div>
  );
}
