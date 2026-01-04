import SummaryBlock from '../blocks/SummaryBlock';
import MarketSnapshotBlock from '../blocks/MarketSnapshotBlock';

/*
=====================================================
 SECTION: MARKET OVERVIEW
 - Dagoverzicht + context
 - Snapshot als anker
=====================================================
*/

export default function ReportSectionMarket({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-8">

      {/* =================================================
          DAGOVERZICHT — tekst + meta
      ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        {/* Tekst */}
        <div className="md:col-span-2">
          <SummaryBlock
            title="Dagoverzicht"
            report={report}
          />
        </div>

        {/* Meta info */}
        <div className="md:col-span-1 text-sm text-gray-500 space-y-1">
          {report.report_date && (
            <div>
              <span className="font-medium text-gray-600">Datum:</span>{' '}
              {report.report_date}
            </div>
          )}

          {report.user_name && (
            <div>
              <span className="font-medium text-gray-600">Rapport voor:</span>{' '}
              {report.user_name}
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          MARKET SNAPSHOT — full width
      ================================================= */}
      <MarketSnapshotBlock report={report} />

    </div>
  );
}
