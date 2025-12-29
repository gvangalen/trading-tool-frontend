"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { Brain } from "lucide-react";

export default function BotDecisionCard({ decision }) {
  if (!decision) return null;

  const actionClass = {
    BUY: "score-buy",
    HOLD: "score-neutral",
    SELL: "score-sell",
    OBSERVE: "text-[var(--text-muted)]",
  };

  return (
    <CardWrapper
      title="Bot Decision Today"
      icon={<Brain className="icon" />}
    >
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <div className="text-sm text-[var(--text-muted)]">Action</div>
          <div className={`text-3xl font-semibold ${actionClass[decision.action]}`}>
            {decision.action}
          </div>
        </div>

        <div>
          <div className="text-sm text-[var(--text-muted)]">Amount</div>
          <div className="text-3xl font-semibold">
            €{decision.amount}
          </div>
        </div>

        <div>
          <div className="text-sm text-[var(--text-muted)]">Confidence</div>
          <div className="text-3xl font-semibold">
            {decision.confidence}
          </div>
        </div>
      </div>

      {decision.reasons?.length > 0 && (
        <ul className="mt-6 space-y-1 text-sm">
          {decision.reasons.map((r, i) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      )}
    </CardWrapper>
  );
}
