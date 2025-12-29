"use client";

import { useState } from "react";
import {
  Brain,
  SlidersHorizontal,
} from "lucide-react";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotScores from "@/components/bot/BotScores";
import BotRules from "@/components/bot/BotRules";
import BotOrderPreview from "@/components/bot/BotOrderPreview";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import CardWrapper from "@/components/ui/CardWrapper";

export default function BotPage() {
  // --------------------------------------------------
  // 🔧 MOCK DATA (later via API)
  // --------------------------------------------------
  const todayDecision = {
    date: "2025-12-29",
    action: "BUY",
    amount: 125,
    confidence: "High",
    reasons: [
      "Market score oversold (32)",
      "Smart DCA setup actief",
      "Macro neutraal",
      "RSI weekly < 40",
    ],
  };

  const scores = {
    macro: 55,
    market: 32,
    technical: 45,
    setup: 80,
  };

  const botRules = [
    { rule: "Market < 35", action: "BUY €150" },
    { rule: "Market 35–55", action: "BUY €125" },
    { rule: "Market 55–75", action: "BUY €100" },
    { rule: "Market > 75", action: "HOLD" },
    { rule: "Setup score < 40", action: "NO BUY" },
  ];

  const history = [
    {
      date: "2025-12-28",
      action: "BUY",
      amount: 100,
      confidence: "Medium",
      executed: true,
    },
    {
      date: "2025-12-27",
      action: "HOLD",
      amount: 0,
      confidence: "Low",
      executed: false,
    },
  ];

  const orderPreview = {
    symbol: "BTC",
    action: todayDecision.action,
    amount: todayDecision.amount,
    status: "planned",
  };

  const [botMode, setBotMode] = useState("manual");
  const [selectedBot, setSelectedBot] = useState("DCA Bot");

  // --------------------------------------------------
  // 🧠 PAGE
  // --------------------------------------------------
  return (
    <div className="space-y-8 animate-fade-slide">
      {/* ================================================= */}
      {/* 🧠 BOT DECISION */}
      {/* ================================================= */}
      <BotDecisionCard decision={todayDecision} />

      {/* ================================================= */}
      {/* 🤖 BOT CONFIG */}
      {/* ================================================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bot select */}
        <CardWrapper
          title="Bot"
          icon={<Brain className="icon" />}
        >
          <select
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
            className="input"
          >
            <option>DCA Bot</option>
            <option>Swing Bot</option>
            <option disabled>Scalp Bot (coming soon)</option>
          </select>
        </CardWrapper>

        {/* Mode */}
        <CardWrapper
          title="Mode"
          icon={<SlidersHorizontal className="icon" />}
        >
          <div className="flex gap-3">
            {[
              { id: "manual", label: "Manual" },
              { id: "semi", label: "Semi-auto" },
              { id: "auto", label: "Auto", disabled: true },
            ].map((m) => (
              <button
                key={m.id}
                disabled={m.disabled}
                onClick={() => setBotMode(m.id)}
                className={`btn-secondary
                  ${botMode === m.id ? "btn-primary" : ""}
                  ${m.disabled ? "opacity-40 cursor-not-allowed" : ""}
                `}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Auto-mode wordt later geactiveerd zodra exchanges gekoppeld zijn.
          </p>
        </CardWrapper>
      </div>

      {/* ================================================= */}
      {/* 📊 SCORES */}
      {/* ================================================= */}
      <BotScores scores={scores} />

      {/* ================================================= */}
      {/* 📐 RULES */}
      {/* ================================================= */}
      <BotRules rules={botRules} />

      {/* ================================================= */}
      {/* 🧾 ORDER PREVIEW */}
      {/* ================================================= */}
      <BotOrderPreview
        order={orderPreview}
        onMarkExecuted={() => console.log("mark executed")}
        onSkip={() => console.log("skip today")}
      />

      {/* ================================================= */}
      {/* 📜 HISTORY */}
      {/* ================================================= */}
      <BotHistoryTable history={history} />
    </div>
  );
}
