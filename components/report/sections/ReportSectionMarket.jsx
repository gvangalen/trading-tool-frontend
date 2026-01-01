import SummaryBlock from '../blocks/SummaryBlock';
import ScoreBarBlock from '../blocks/ScoreBarBlock';
import MarketSnapshotBlock from '../blocks/MarketSnapshotBlock';

export default function ReportSectionMarket({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-4">
      <SummaryBlock
        title="Dagoverzicht"
        summary={report.executive_summary}
      />

      <ScoreBarBlock
        macro={report.macro_score}
        technical={report.technical_score}
        market={report.market_score}
        setup={report.setup_score}
      />

      <MarketSnapshotBlock report={report} />
    </div>
  );
}
