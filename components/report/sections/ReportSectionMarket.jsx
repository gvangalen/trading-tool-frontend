import SummaryBlock from "../blocks/SummaryBlock";
import MarketSnapshotBlock from "../blocks/MarketSnapshotBlock";

export default function ReportSectionMarket({ report }) {
  if (!report) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

      {/* LINKS: DAGOVERZICHT + META */}
      <div className="md:col-span-2">
        <SummaryBlock report={report} />
      </div>

      {/* RECHTS: MARKET SNAPSHOT */}
      <div className="md:col-span-1">
        <MarketSnapshotBlock report={report} />
      </div>

    </div>
  );
}
