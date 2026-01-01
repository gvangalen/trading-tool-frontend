import NarrativeBlock from '../blocks/NarrativeBlock';
import DataListBlock from '../blocks/DataListBlock';

export default function ReportSectionAnalysis({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-4">
      <NarrativeBlock
        title="Macro Context"
        text={report.macro_context}
        color="gray"
      />

      <NarrativeBlock
        title="Setup Validatie"
        text={report.setup_validation}
        color="green"
      />

      <DataListBlock
        title="Indicator Highlights"
        items={Array.isArray(report.indicator_highlights)
          ? report.indicator_highlights.map(
              (i) => `${i.indicator}: score ${i.score} → ${i.interpretation}`
            )
          : []}
      />
    </div>
  );
}

