import SummaryBlock from "../blocks/SummaryBlock";
import MarketSnapshotBlock from "../blocks/MarketSnapshotBlock";
import SectionAlignedAside from "../layout/SectionAlignedAside";

/*
=====================================================
 SECTION: MARKET OVERVIEW
 - Opening van het rapport
 - Dagoverzicht + context
 - Market snapshot als anker
=====================================================
*/

export default function ReportSectionMarket({ report }) {
  if (!report) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

      {/* LINKS: DAGOVERZICHT + META */}
      <div className="md:col-span-2">
        <SummaryBlock report={report} />
      </div>

      {/* RECHTS: MARKET SNAPSHOT (uitgelijnd) */}
      <SectionAlignedAside>
        <MarketSnapshotBlock report={report} />
      </SectionAlignedAside>

    </div>
  );
}
