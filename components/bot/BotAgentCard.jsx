"use client";

import { useState } from "react";

import CardWrapper from "@/components/ui/CardWrapper";
import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";
import BotHistoryTable from "@/components/bot/BotHistoryTable";

import { Brain, MoreVertical, ChevronDown } from "lucide-react";

/**
 * BotAgentCard
 * --------------------------------------------------
 * Eén bot = één overzicht (v2.0)
 *
 * Layout:
 * - Header
 * - Tabs: Decision | Portfolio | History
 * - Desktop: tabs
 * - Mobile: accordion
 *
 * Props:
 * - bot
 * - decision
 * - portfolio
 * - history
 * - loadingDecision
 * - onGenerate
 * - onExecute
 * - onSkip
 * - onUpdateBudget
 */
export default function BotAgentCard({
  bot,
  decision,
  portfolio,
  history = [],
  loadingDecision = false,

  onGenerate,
  onExecute,
  onSkip,
  onUpdateBudget,
}) {
  if (!bot || !portfolio) return null;

  const TABS = ["decision", "portfolio", "history"];
  const [activeTab, setActiveTab] = useState("decision");
  const [accordionOpen, setAccordionOpen] = useState("decision");

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  /* =====================================================
     RENDER TAB CONTENT
  ===================================================== */
  const renderContent = (tab) => {
    switch (tab) {
      case "decision":
        return (
          <BotDecisionCard
            bot={bot}
            decision={decision}
            loading={loadingDecision}
            onGenerate={onGenerate}
            onExecute={onExecute}
            onSkip={onSkip}
            compact
          />
        );

      case "portfolio":
        return (
          <BotPortfolioCard
            bot={portfolio}
            onUpdateBudget={onUpdateBudget}
          />
        );

      case "history":
        return (
          <BotHistoryTable
            history={history.filter(
              (h) => h.bot_id === bot.id
            )}
            compact
          />
        );

      default:
        return null;
    }
  };

  /* =====================================================
     MOBILE ACCORDION
  ===================================================== */
  if (isMobile) {
    return (
      <CardWrapper className="space-y-4">
        {/* HEADER */}
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
                {bot.strategy?.name ?? "—"} · {bot.symbol}
              </div>
            </div>
          </div>

          <MoreVertical size={16} className="icon-muted" />
        </div>

        {/* ACCORDION SECTIONS */}
        {TABS.map((tab) => {
          const open = accordionOpen === tab;
          return (
            <div
              key={tab}
              className="border rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setAccordionOpen(open ? null : tab)
                }
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
              >
                <span className="capitalize">{tab}</span>
                <ChevronDown
                  size={16}
                  className={`transition ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="p-4 bg-[var(--bg-soft)]">
                  {renderContent(tab)}
                </div>
              )}
            </div>
          );
        })}
      </CardWrapper>
    );
  }

  /* =====================================================
     DESKTOP TABS
  ===================================================== */
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

        <button className="icon-muted hover:icon-primary">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* =====================================================
         TABS
      ===================================================== */}
      <div className="flex gap-2 border-b text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-md capitalize ${
              activeTab === tab
                ? "bg-[var(--bg-soft)] font-medium"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* =====================================================
         CONTENT
      ===================================================== */}
      <div className="pt-2">{renderContent(activeTab)}</div>
    </CardWrapper>
  );
}
