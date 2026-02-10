"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ReportLayout from "@/components/report/layout/ReportLayout";

export default function PrintReportPage() {
  const params = useSearchParams();

  const type = params.get("type") || "daily";
  const date = params.get("date");
  const token = params.get("token");

  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!date || !token) return;

      try {
        const res = await fetch(
          `/api/public/report/${type}?date=${date}&token=${token}`
        );

        const data = await res.json();

        setReport(data);

        // 🔥 CRUCIAAL VOOR PLAYWRIGHT
        setTimeout(() => {
          document.body.setAttribute("data-print-ready", "true");
        }, 250);
      } catch (err) {
        console.error("PRINT LOAD ERROR", err);
      }
    };

    load();
  }, [type, date, token]);

  if (!report) {
    return <div style={{ padding: 40 }}>Loading report...</div>;
  }

  return (
    <div className="print-wrapper">
      <ReportLayout report={report} isPrint />
    </div>
  );
}
