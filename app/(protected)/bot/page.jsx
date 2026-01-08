"use client";

import { useState } from "react";
import {
  Brain,
  SlidersHorizontal,
  Bot as BotIcon,
} from "lucide-react";

import useBotData from "@/hooks/useBotData";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotScores from "@/components/bot/BotScores";
import BotRules from "@/components/bot/BotRules";
import BotOrderPreview from "@/components/bot/BotOrderPreview";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import AddBotModal from "@/components/bot/AddBotModal";

import CardWrapper from "@/components/ui/CardWrapper";

export default function BotPage() {
  /* =====================================================
     🧠 STATE
  ===================================================== */
  const [showAddBot, setShowAddBot] = useState(false);

  /* =====================================================
     🧠 DATA
  ===================================================== */
  const {
    configs = [],
    today = null,
    history = [],
    loading,
    runBotToday,
    executeBot,
    skipBot,
    createBot,          // ⬅️ NODIG
    refresh,            // ⬅️ voor configs reload
  } = useBotData();

  const decision = today?.decisions?.[0] ?? null;
  const order = today?.orders?.[0] ?? null;
  const activeBot = configs?.[0] ?? null;

  /* =====================================================
     🧠 PAGE
  ===================================================== */
  return (
    <div className="space-y-8 animate-fade-slide">
      {/* ================================================= */}
      {/* 🧠 PAGE TITLE */}
      {/* ================================================= */}
      <div className="flex items-center gap-3">
        <BotIcon className="w-6 h-6 text-[var(--accent)]" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Trading Bots
        </h1>
      </div>

      {/* ================================================= */}
      {/* 🤖 BOT DECISION TODAY */}
      {/* ================================================= */}
      <BotDecisionCard
        decision={decision}
        loading={loading.today}
        onGenerate={() => runBotToday()}
      />

      {/* ================================================= */}
      {/* 🤖 BOT CONFIG */}
      {/* ================================================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ================= BOT SELECT ================= */}
        <CardWrapper
          title="Bot"
          icon={<Brain className="icon" />}
        >
          {configs.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-[var(--text-muted)]">
                Je hebt nog geen bots.
              </p>

              <button
                className="btn-primary"
                onClick={() => setShowAddBot(true)}
              >
                ➕ Bot toevoegen
              </button>
            </div>
          ) : (
            <>
              <select
                value={activeBot?.id || ""}
                disabled
                className="input opacity-70 cursor-not-allowed"
              >
                {configs.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Meerdere bots volgen later.
              </p>
            </>
          )}
        </CardWrapper>

        {/* ================= MODE ================= */}
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
                className={`
                  btn-secondary
                  ${m.id === activeBot?.mode ? "btn-primary" : ""}
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
      <BotScores
        scores={decision?.scores || {
          macro: null,
          market: null,
          technical: null,
          setup: null,
        }}
        loading={loading.today}
      />

      {/* ================================================= */}
      {/* 📐 RULES */}
      {/* ================================================= */}
      <BotRules rules={activeBot?.rules || []} />

      {/* ================================================= */}
      {/* 🧾 ORDER PREVIEW */}
      {/* ================================================= */}
      <BotOrderPreview
        order={order}
        loading={loading.action}
        onMarkExecuted={() =>
          executeBot({
            bot_id: decision?.bot_id,
            report_date: today?.date,
            symbol: order?.symbol,
            side: order?.side,
            amount_eur: order?.amount_eur,
          })
        }
        onSkip={() =>
          skipBot({
            bot_id: decision?.bot_id,
            report_date: today?.date,
          })
        }
      />

      {/* ================================================= */}
      {/* 📜 HISTORY */}
      {/* ================================================= */}
      <BotHistoryTable
        history={history}
        loading={loading.history}
      />

      {/* ================================================= */}
      {/* ➕ ADD BOT MODAL */}
      {/* ================================================= */}
      <AddBotModal
        open={showAddBot}
        onClose={() => setShowAddBot(false)}
        onCreated={async (payload) => {
          await createBot(payload);     // ⬅️ backend POST
          await refresh.configs();      // ⬅️ direct zichtbaar
          setShowAddBot(false);
        }}
      />
    </div>
  );
}
