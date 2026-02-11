// SERVER component (geen "use client")

import ReportLayout from "@/components/report/layout/ReportLayout";

export default async function PrintReportPage({ searchParams }) {
  const token = searchParams?.token;

  if (!token) {
    return <div style={{ padding: 40 }}>Missing print token</div>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/report?token=${token}`,
      {
        cache: "no-store", // altijd fresh
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch report");
    }

    const report = await res.json();

    return (
      <div className="print-wrapper">
        <ReportLayout report={report} isPrint />

        {/* 🔥 Playwright marker */}
        <div data-print-ready="true" />
      </div>
    );
  } catch (err) {
    console.error("PRINT FETCH ERROR:", err);

    return (
      <div style={{ padding: 40 }}>
        Failed to load report for printing.
      </div>
    );
  }
}
