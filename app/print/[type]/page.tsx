"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ReportLayout from "@/components/report/layout/ReportLayout";
import { fetchAuth } from "@/lib/api/auth";

export default function PrintReportPage() {
  const params = useSearchParams();

  const type = params.get("type") || "daily";
  const date = params.get("date");

  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!date) return;

      const res = await fetchAuth(
        `/api/report/${type}/by-date?date=${date}`
      );

      setReport(res);
    };

    load();
  }, [type, date]);

  if (!report) {
    return (
      <div style={{ padding: 40 }}>
        Loading report...
      </div>
    );
  }

  return (
    <div className="print-wrapper">
      <ReportLayout report={report} />
    </div>
  );
}
