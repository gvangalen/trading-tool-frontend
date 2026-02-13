// SERVER component (GEEN "use client")

import ReportLayout from "@/components/report/layout/ReportLayout";

export default async function PrintReportPage({ searchParams }) {
  const token = searchParams?.token;

  // ❗️NOOIT early return zonder marker
  if (!token) {
    return (
      <div className="print-wrapper">
        Missing print token
        <div data-print-ready="true" />
      </div>
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/report?token=${token}`,
      {
        cache: "no-store",
      }
    );

    // ❗️OOK hier marker teruggeven
    if (!res.ok) {
      return (
        <div className="print-wrapper">
          Failed to fetch report
          <div data-print-ready="true" />
        </div>
      );
    }

    const report = await res.json();

    return (
      <div className="print-wrapper">
        <ReportLayout report={report} isPrint />

        {/* 🔥 PLAYWRIGHT TRIGGER — ALTIJD RENDEREN */}
        <div data-print-ready="true" />
      </div>
    );
  } catch (err) {
    console.error("PRINT FETCH ERROR:", err);

    // ❗️OOK BIJ ERROR → marker
    return (
      <div className="print-wrapper">
        Failed to load report for printing.
        <div data-print-ready="true" />
      </div>
    );
  }
}
