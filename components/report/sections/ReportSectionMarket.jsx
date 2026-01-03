import SummaryBlock from '../blocks/SummaryBlock';
// import ScoreBarBlock from '../blocks/ScoreBarBlock';
import MarketSnapshotBlock from '../blocks/MarketSnapshotBlock';

export default function ReportSectionMarket({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-4">
      {/* DAGOVERZICHT / EXECUTIVE SUMMARY */}
      <SummaryBlock
        title="Dagoverzicht"
        report={report}
      />

      {/* ❌ SCORES — verwijderd (duplicatie) */}
      {/* <ScoreBarBlock report={report} /> */}

      {/* ✅ MARKT SNAPSHOT — ENIGE SCORE-OVERZICHT */}
      <MarketSnapshotBlock report={report} />
    </div>
  );
}
