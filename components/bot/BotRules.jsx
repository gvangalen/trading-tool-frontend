"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { SlidersHorizontal } from "lucide-react";

export default function BotRules({ rules }) {
  if (!rules?.length) return null;

  return (
    <CardWrapper
      title="Bot Rules"
      icon={<SlidersHorizontal className="icon" />}
    >
      <div className="space-y-3 text-sm">
        {rules.map((r, i) => (
          <div
            key={i}
            className="flex justify-between border-b border-[var(--border)] pb-2"
          >
            <span>{r.rule}</span>
            <span className="font-medium">{r.action}</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}
