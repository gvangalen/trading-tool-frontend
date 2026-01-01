import NarrativeBlock from '../blocks/NarrativeBlock';

/* =====================================================
   SECTION: STRATEGIE
   - Wat betekent dit concreet?
   - Hoe handelen we?
   - Wat verwachten we vooruit?
===================================================== */

export default function ReportSectionStrategy({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-4">
      {/* STRATEGIE IMPLICATIE — wat betekent dit voor handelen? */}
      <NarrativeBlock
        title="Strategie Implicatie"
        field="strategy_implication"
        report={report}
        color="red"
      />

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
