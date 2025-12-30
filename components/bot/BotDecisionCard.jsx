"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { Brain } from "lucide-react";

export default function BotDecisionCard({
  decision = null,
  loading = false,
  onGenerate,
}) {
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
      {/* ===================== */}
      {/* LOADING STATE */}
      {/* ===================== */}
      {loading && (
        <CardLoader text="Beslissing ophalen…" />
      )}

      {/* ===================== */}
      {/* EMPTY STATE */}
      {/* ===================== */}
      {!loading && !decision && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">
            Er is vandaag nog geen bot-beslissing gegenereerd.
          </p>

          {onGenerate && (
            <button
              onClick={onGenerate}
              className="btn-primary"
            >
              Genereer beslissing
            </button>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* DECISION CONTENT */}
      {/* ===================== */}
      {!loading && decision && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-[var(--text-muted)]">
                Action
              </div>
              <div
                className={`text-3xl font-semibold ${
                  actionClass[decision.action] ||
                  "text-[var(--text-dark)]"
                }`}
              >
                {decision.action}
              </div>
            </div>

            <div>
              <div className="text-sm text-[var(--text-muted)]">
                Amount
              </div>
              <div className="text-3xl font-semibold">
                €{decision.amount_eur ?? decision.amount ?? 0}
              </div>
            </div>

            <div>
              <div className="text-sm text-[var(--text-muted)]">
                Confidence
              </div>
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
        </>
      )}
    </CardWrapper>
  );
}
