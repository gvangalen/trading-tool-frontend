'use client';

import ReportSectionMarket from '@/components/report/sections/ReportSectionMarket';
import ReportSectionAnalysis from '@/components/report/sections/ReportSectionAnalysis';
import ReportSectionStrategy from '@/components/report/sections/ReportSectionStrategy';

/*
=====================================================
 ReportLayout
=====================================================
*/

export default function ReportLayout({ report, isPrint = false }) {
  if (!report) return null;

  return (
    <div
      className={`
        mx-auto 
        ${isPrint ? "max-w-[1100px]" : "max-w-7xl"}
        px-6 
        space-y-16
      `}
    >
      {/* 1️⃣ MARKT OVERZICHT */}
      <section className="card">
        <ReportSectionMarket report={report} isPrint={isPrint} />
      </section>

      {/* 2️⃣ ANALYSE */}
      <section className="card">
        <ReportSectionAnalysis report={report} isPrint={isPrint} />
      </section>

      {/* 3️⃣ STRATEGIE */}
      <section className="card">
        <ReportSectionStrategy report={report} isPrint={isPrint} />
      </section>
    </div>
  );
}
