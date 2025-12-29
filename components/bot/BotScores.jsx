"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { BarChart3 } from "lucide-react";

export default function BotScores({ scores }) {
  if (!scores) return null;

  return (
    <CardWrapper
      title="Scores"
      icon={<BarChart3 className="icon" />}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(scores).map(([key, value]) => (
          <div
            key={key}
            className="border border-[var(--border)] rounded-[var(--radius-sm)] p-4 text-center"
          >
            <div className="text-sm text-[var(--text-muted)] capitalize">
              {key}
            </div>
            <div className="text-2xl font-semibold">
              {value}
            </div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}
