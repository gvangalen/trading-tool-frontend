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
      icon={<Clock className="icon" />}
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
            {history.map((h, i) => (
              <tr
                key={i}
                className="border-b border-[var(--border)] last:border-0"
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
                <td>
                  {h.executed
                    ? "Executed"
                    : h.status || "Planned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CardWrapper>
  );
}
