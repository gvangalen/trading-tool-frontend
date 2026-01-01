import NarrativeBlock from '../blocks/NarrativeBlock';
import { Target, Forward } from 'lucide-react';

export default function ReportSectionStrategy({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-4">
      <NarrativeBlock
        title="Strategie Implicatie"
        text={report.strategy_implication}
        color="red"
      />

      <NarrativeBlock
        title="Vooruitblik & Scenario’s"
        text={report.outlook}
        color="gray"
      />
    </div>
  );
}
