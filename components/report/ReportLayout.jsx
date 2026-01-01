'use client';

import ReportSectionMarket from './sections/ReportSectionMarket';
import ReportSectionAnalysis from './sections/ReportSectionAnalysis';
import ReportSectionStrategy from './sections/ReportSectionStrategy';

/*
=====================================================
 ReportLayout
 - Verantwoordelijk voor:
   • volgorde van het verhaal
   • structuur van het rapport
   • leesflow (data → uitleg → actie)
 - GEEN business logic
 - GEEN formatting
=====================================================
*/

export default function ReportLayout({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-12">
      {/* =================================================
          1️⃣ MARKT OVERZICHT
          - Wat is er gebeurd?
          - Waar staan we nu?
      ================================================= */}
      <section>
        <ReportSectionMarket report={report} />
      </section>

      {/* =================================================
          2️⃣ ANALYSE & ONDERBOUWING
          - Waarom is dit zo?
          - Wat zeggen macro / setups / indicators?
      ================================================= */}
      <section>
        <ReportSectionAnalysis report={report} />
      </section>

      {/* =================================================
          3️⃣ STRATEGIE & VOORUITBLIK
          - Wat betekent dit?
          - Hoe handelen we?
          - Scenario’s vooruit
      ================================================= */}
      <section>
        <ReportSectionStrategy report={report} />
      </section>
    </div>
  );
}
