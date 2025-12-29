"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { Clock } from "lucide-react";

export default function BotHistoryTable({ history }) {
  if (!history?.length) return null;

  return (
    <CardWrapper
      title="Bot History"
      icon={<Clock className="icon" />}
    >
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
              <td className="py-2">{h.date}</td>
              <td>{h.action}</td>
              <td>€{h.amount}</td>
              <td>{h.confidence}</td>
              <td>{h.executed ? "Executed" : "Planned"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardWrapper>
  );
}
