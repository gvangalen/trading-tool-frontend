"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { Clock } from "lucide-react";

export default function BotHistoryTable({
  history = [],
  loading = false,
}) {
  return (
    <CardWrapper
      title="Bot History"
      icon={<Clock className="icon icon-muted" />}
    >
      {/* ===================== */}
      {/* LOADING STATE */}
      {/* ===================== */}
      {loading && (
        <CardLoader text="Geschiedenis laden…" />
      )}

      {/* ===================== */}
      {/* EMPTY STATE */}
      {/* ===================== */}
      {!loading && history.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">
          Er zijn nog geen bot-acties uitgevoerd.
        </p>
      )}

      {/* ===================== */}
      {/* TABLE */}
      {/* ===================== */}
      {!loading && history.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--text-muted)] border-b border-[var(--border)]">
              <th className="py-2">Date</th>
              <th>Action</th>
              <th>Amount</th>
              <th>Confidence</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {history.map((h, i) => {
              let statusClass = "text-[var(--text-muted)]";

              if (h.executed) statusClass = "icon-success";
              else if (h.status === "failed") statusClass = "icon-danger";
              else if (h.status === "skipped") statusClass = "icon-warning";

              return (
                <tr
                  key={i}
                  className="
                    border-b border-[var(--border)] last:border-0
                    hover:bg-[var(--surface-2)]
                    transition
                  "
                >
                  <td className="py-2">
                    {h.date || "—"}
                  </td>

                  <td>
                    {h.action || "—"}
                  </td>

                  <td>
                    €{h.amount_eur ?? h.amount ?? 0}
                  </td>

                  <td>
                    {h.confidence || "—"}
                  </td>

                  <td className={`font-medium ${statusClass}`}>
                    {h.executed
                      ? "Executed"
                      : h.status || "Planned"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </CardWrapper>
  );
}
