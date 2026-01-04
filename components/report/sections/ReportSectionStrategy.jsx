import NarrativeBlock from '../blocks/NarrativeBlock';

/* =====================================================
   SECTION: STRATEGIE
   - Alleen vooruitblik / scenario’s
   - Strategie-implicatie zit in Analysis
===================================================== */

export default function ReportSectionStrategy({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-4">
      {/* VOORUITBLIK — scenario’s & verwachting */}
      <NarrativeBlock
        title="Vooruitblik & Scenario’s"
        field="outlook"
        report={report}
        color="gray"
      />
    </div>
  );
}
