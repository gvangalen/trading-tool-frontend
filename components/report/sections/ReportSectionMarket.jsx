import SummaryBlock from '../blocks/SummaryBlock';
import ScoreBarBlock from '../blocks/ScoreBarBlock';
import MarketSnapshotBlock from '../blocks/MarketSnapshotBlock';

/* =====================================================
   SECTION: MARKET
   - Wat is er gebeurd?
   - Waar staan we nu?
   - Eerste context vóór analyse
===================================================== */

export default function ReportSectionMarket({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-4">
      {/* DAGOVERZICHT / EXECUTIVE SUMMARY */}
      <SummaryBlock
        title="Dagoverzicht"
        report={report}
      />

      {/* SCORES — macro / technical / market / setup */}
      <ScoreBarBlock report={report} />

      {/* MARKT SNAPSHOT — prijs, volume, scores */}
      <MarketSnapshotBlock report={report} />
    </div>
  );
}
