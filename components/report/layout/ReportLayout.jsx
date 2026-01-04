'use client';

import ReportSectionMarket from '@/components/report/sections/ReportSectionMarket';
import ReportSectionAnalysis from '@/components/report/sections/ReportSectionAnalysis';
import ReportSectionStrategy from '@/components/report/sections/ReportSectionStrategy';

/*
=====================================================
 ReportLayout
 - Verantwoordelijk voor:
   • volgorde van het verhaal
   • structuur van het rapport
   • leesflow (data → uitleg → actie)
 - GEEN business logic
 - MINIMALE layout (content-breedte)
=====================================================
*/

export default function ReportLayout({ report }) {
  if (!report) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 space-y-16">
      {/* =================================================
          1️⃣ MARKT OVERZICHT
      ================================================= */}
      <section>
        <ReportSectionMarket report={report} />
      </section>

      {/* =================================================
          2️⃣ ANALYSE & ONDERBOUWING
      ================================================= */}
      <section>
        <ReportSectionAnalysis report={report} />
      </section>

      {/* =================================================
          3️⃣ STRATEGIE & VOORUITBLIK
      ================================================= */}
      <section>
        <ReportSectionStrategy report={report} />
      </section>
    </div>
  );
}
