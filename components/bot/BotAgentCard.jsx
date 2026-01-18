"use client";

import CardWrapper from "@/components/ui/CardWrapper";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";

import { Brain, MoreVertical } from "lucide-react";

/**
 * BotAgentCard
 * --------------------------------------------------
 * Gecombineerde bot card (v2.0)
 *
 * Eén bot = één overzicht:
 * - Decision (primair)
 * - Portfolio & budget
 *
 * Props:
 * - bot                → bot config
 * - decision           → decision van vandaag (of null)
 * - portfolio          → portfolio object
 * - loadingDecision    → boolean
 * - onGenerate         → () => Promise
 * - onExecute          → fn
 * - onSkip             → fn
 * - onUpdateBudget     → (bot_id, payload) => Promise
 */
export default function BotAgentCard({
  bot,
  decision,
  portfolio,
  loadingDecision = false,

  onGenerate,
  onExecute,
  onSkip,
  onUpdateBudget,
}) {
  if (!bot || !portfolio) return null;

  return (
    <CardWrapper className="space-y-5">
      {/* =====================================================
         HEADER
      ===================================================== */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="icon-primary">
            <Brain size={18} />
          </div>

          <div>
            <div className="font-semibold leading-tight">
              {bot.name}
            </div>

            <div className="text-xs text-[var(--text-muted)]">
              {bot.strategy?.name ?? "—"} · {bot.symbol} ·{" "}
              {bot.timeframe ?? "—"}
            </div>
          </div>
        </div>

        {/* placeholder voor future menu */}
        <button className="icon-muted hover:icon-primary">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* =====================================================
         DECISION (PRIMARY SECTION)
      ===================================================== */}
      <div>
        <BotDecisionCard
          bot={bot}
          decision={decision}
          loading={loadingDecision}
          onGenerate={onGenerate}
          onExecute={onExecute}
          onSkip={onSkip}
          compact
        />
      </div>

      {/* =====================================================
         PORTFOLIO + BUDGET
      ===================================================== */}
      <div className="pt-2 border-t">
        <BotPortfolioCard
          bot={portfolio}
          onUpdateBudget={onUpdateBudget}
        />
      </div>
    </CardWrapper>
  );
}
