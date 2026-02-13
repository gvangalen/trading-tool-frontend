// SERVER component

export const dynamic = "force-dynamic";
export const revalidate = 0;

import ReportLayout from "@/components/report/layout/ReportLayout";

export default async function DailyPrintReportPage({ searchParams }) {
  const token = searchParams?.token;

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

    if (!res.ok) {
      throw new Error("Failed to fetch report");
    }

    const report = await res.json();

    return (
      <div className="print-wrapper">
        <ReportLayout report={report} isPrint />
        <div data-print-ready="true" />
      </div>
    );
  } catch (err) {
    console.error("PRINT FETCH ERROR:", err);

    return (
      <div className="print-wrapper">
        Failed to load report for printing.
        <div data-print-ready="true" />
      </div>
    );
  }
}
