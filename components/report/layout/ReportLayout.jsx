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

      {/* 1️⃣ MARKT OVERZICHT */}
      <section>
        <ReportSectionMarket report={report} />
      </section>

      {/* 2️⃣ ANALYSE & ONDERBOUWING */}
      <section>
        <ReportSectionAnalysis report={report} />
      </section>

      {/* 3️⃣ STRATEGIE & VOORUITBLIK */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2">
            <ReportSectionStrategy report={report} />
          </div>
        </div>
      </section>

    </div>
  );
}
