"use client";

import { useState, useEffect } from "react";

import CardWrapper from "@/components/ui/CardWrapper";
import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";
import BotHistoryTable from "@/components/bot/BotHistoryTable";

import { Brain, MoreVertical, ChevronDown } from "lucide-react";

/**
 * BotAgentCard
 * --------------------------------------------------
 * Eén bot = één horizontale agent card
 *
 * Layout:
 * - Header (bot meta)
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
  const [isMobile, setIsMobile] = useState(false);

  /* =====================================================
     RESPONSIVE CHECK (client-safe)
  ===================================================== */
  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* =====================================================
     TAB CONTENT
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
            history={history.filter((h) => h.bot_id === bot.id)}
            compact
          />
        );

      default:
        return null;
    }
  };

  /* =====================================================
     MOBILE — ACCORDION
  ===================================================== */
  if (isMobile) {
    return (
      <CardWrapper className="space-y-4">
        {/* HEADER */}
        <Header bot={bot} />

        {/* ACCORDION */}
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
                  className={`transition-transform ${
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
     DESKTOP — TABS (FULL WIDTH)
  ===================================================== */
  return (
    <CardWrapper className="space-y-4">
      {/* HEADER */}
      <Header bot={bot} />

      {/* TABS */}
      <div className="flex gap-4 border-b text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 -mb-px border-b-2 capitalize transition ${
              activeTab === tab
                ? "border-primary font-medium"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="pt-2">{renderContent(activeTab)}</div>
    </CardWrapper>
  );
}

/* =====================================================
   HEADER (shared)
===================================================== */
function Header({ bot }) {
  return (
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
  );
}
