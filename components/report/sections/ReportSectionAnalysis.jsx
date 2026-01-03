import NarrativeBlock from '../blocks/NarrativeBlock';
import DataListBlock from '../blocks/DataListBlock';

export default function ReportSectionAnalysis({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-10">

      {/* =========================
         MACRO ANALYSE
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <NarrativeBlock
            title="Macro Context"
            field="macro_context"
            report={report}
          />
        </div>

        <div className="md:col-span-1">
          <DataListBlock
            report={report}
            field="macro_indicator_highlights"
            title="Macro Indicator Highlights"
          />
        </div>
      </div>

      {/* =========================
         TECHNISCHE ANALYSE
      ========================= */}
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

      {/* =========================
         SETUP VALIDATIE
      ========================= */}
      <NarrativeBlock
        title="Setup Validatie"
        field="setup_validation"
        report={report}
      />

    </div>
  );
}
