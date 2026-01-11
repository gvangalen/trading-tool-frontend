"use client";

import { useEffect, useRef, useState } from "react";
import { Bot as BotIcon } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useModal } from "@/components/modal/ModalProvider";

import BotCard from "@/components/bot/BotCard";
import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotScores from "@/components/bot/BotScores";
import BotOrderPreview from "@/components/bot/BotOrderPreview";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import AddBotForm from "@/components/bot/AddBotForm";

export default function BotPage() {
  /* =====================================================
     🧠 MODAL / FORM
  ===================================================== */
  const { openConfirm, showSnackbar } = useModal();
  const formRef = useRef({});

  /* =====================================================
     🧠 UI STATE
  ===================================================== */
  const [activeBotId, setActiveBotId] = useState(null);

  /* =====================================================
     🤖 BOT DATA
  ===================================================== */
  const {
    configs: bots = [],
    today,
    history,
    loading,
    createBot,
    updateBot,
    deleteBot,
    runBotToday,
    executeBot,
    skipBot,
  } = useBotData();

  /* =====================================================
     🧠 STRATEGY DATA
  ===================================================== */
  const {
    strategies = [],
    loadStrategies,
  } = useStrategyData();

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  /* =====================================================
     ✅ DEFAULT BOT
  ===================================================== */
  useEffect(() => {
    if (!activeBotId && bots.length > 0) {
      setActiveBotId(bots[0].id);
    }
  }, [bots, activeBotId]);

  const activeBot =
    bots.find((b) => b.id === activeBotId) ?? null;

  const decision = today?.decisions?.[0] ?? null;
  const order = today?.orders?.[0] ?? null;

  /* =====================================================
     ➕ ADD BOT
  ===================================================== */
  const handleAddBot = () => {
    formRef.current = {
      name: "",
      strategy_id: "",
      mode: "manual",
    };

    openConfirm({
      title: "➕ Nieuwe bot",
      description: (
        <AddBotForm
          initialForm={formRef.current}
          strategies={strategies}
          onChange={(v) => (formRef.current = v)}
        />
      ),
      confirmText: "Opslaan",
      onConfirm: async () => {
        if (!formRef.current.name) {
          showSnackbar("Naam is verplicht", "danger");
          return;
        }

        if (!formRef.current.strategy_id) {
          showSnackbar("Selecteer een strategie", "danger");
          return;
        }

        const res = await createBot(formRef.current);
        if (res?.id) setActiveBotId(res.id);

        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  /* =====================================================
     ✏️ EDIT BOT
  ===================================================== */
  const handleEditBot = (botId) => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return;

    formRef.current = {
      name: bot.name,
      strategy_id: bot.strategy_id ?? "",
      mode: bot.mode,
    };

    openConfirm({
      title: "✏️ Bot bewerken",
      description: (
        <AddBotForm
          initialForm={formRef.current}
          strategies={strategies}
          onChange={(v) => (formRef.current = v)}
        />
      ),
      confirmText: "Opslaan",
      onConfirm: async () => {
        await updateBot(bot.id, formRef.current);
        showSnackbar("Bot aangepast", "success");
      },
    });
  };

  /* =====================================================
     🗑 DELETE BOT
  ===================================================== */
  const handleDeleteBot = (botId) => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return;

    openConfirm({
      title: "🗑 Bot verwijderen",
      tone: "danger",
      description: (
        <>Weet je zeker dat <b>{bot.name}</b> weg mag?</>
      ),
      confirmText: "Verwijderen",
      onConfirm: async () => {
        await deleteBot(bot.id);

        if (activeBotId === bot.id) {
          setActiveBotId(bots[0]?.id ?? null);
        }

        showSnackbar("Bot verwijderd", "success");
      },
    });
  };

  /* =====================================================
     ▶️ RUN BOT
  ===================================================== */
  const handleRunBot = (botId) => {
    runBotToday(botId);
  };

  /* =====================================================
     🧠 PAGE
  ===================================================== */
  return (
    <div className="space-y-8 animate-fade-slide">
      {/* ===== TITLE ===== */}
      <div className="flex items-center gap-3">
        <BotIcon className="w-6 h-6 text-[var(--accent)]" />
        <h1 className="text-2xl font-semibold">
          Trading Bots
        </h1>
      </div>

      {/* ===== TODAY ===== */}
      <BotDecisionCard
        decision={decision}
        loading={loading.today}
        onGenerate={runBotToday}
      />

      {/* ===== BOTS GRID ===== */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <BotCard
            key={bot.id}
            bot={bot}
            isActive={bot.id === activeBotId}
            onSelect={(id) => setActiveBotId(id)}
            onEdit={(id) => handleEditBot(id)}
            onDelete={(id) => handleDeleteBot(id)}
            onRun={(id) => handleRunBot(id)}
          />
        ))}

        {/* ADD BOT CARD */}
        <button
          onClick={handleAddBot}
          className="
            rounded-xl border border-dashed border-[var(--border)]
            p-6 text-sm text-muted
            hover:border-[var(--accent)]
          "
        >
          ➕ Nieuwe bot toevoegen
        </button>
      </div>

      {/* ===== SCORES ===== */}
      <BotScores
        scores={decision?.scores || {}}
        loading={loading.today}
      />

      {/* ===== ORDER ===== */}
      <BotOrderPreview
        order={order}
        loading={loading.action}
        onMarkExecuted={() =>
          executeBot({
            bot_id: decision?.bot_id,
            report_date: today?.date,
          })
        }
        onSkip={() =>
          skipBot({
            bot_id: decision?.bot_id,
            report_date: today?.date,
          })
        }
      />

      {/* ===== HISTORY ===== */}
      <BotHistoryTable
        history={history}
        loading={loading.history}
      />
    </div>
  );
}
