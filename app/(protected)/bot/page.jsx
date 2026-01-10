"use client";

import { useEffect, useRef, useState } from "react";
import { Bot as BotIcon } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useModal } from "@/components/modal/ModalProvider";

import BotCard from "@/components/bot/BotCard";
import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotScores from "@/components/bot/BotScores";
import BotOrderPreview from "@/components/bot/BotOrderPreview";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import AddBotForm from "@/components/bot/AddBotForm";

export default function BotPage() {
  const { openConfirm, showSnackbar } = useModal();
  const formRef = useRef({});

  const [activeBotId, setActiveBotId] = useState(null);

  const {
    configs = [],
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

  /* ================= DEFAULT BOT ================= */
  useEffect(() => {
    if (!activeBotId && configs.length > 0) {
      setActiveBotId(configs[0].id);
    }
  }, [configs, activeBotId]);

  const activeBot =
    configs.find((b) => b.id === activeBotId) ?? null;

  const decision = today?.decisions?.[0] ?? null;
  const order = today?.orders?.[0] ?? null;

  /* ================= ADD BOT ================= */
  const handleAddBot = () => {
    formRef.current = {
      name: "",
      bot_type: "dca",
      symbol: "BTC",
      mode: "manual",
    };

    openConfirm({
      title: "➕ Nieuwe bot",
      description: (
        <AddBotForm
          initialForm={formRef.current}
          onChange={(v) => (formRef.current = v)}
        />
      ),
      confirmText: "Opslaan",
      onConfirm: async () => {
        if (!formRef.current.name) {
          showSnackbar("Naam is verplicht", "danger");
          return;
        }

        const res = await createBot(formRef.current);
        if (res?.id) setActiveBotId(res.id);

        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  /* ================= EDIT BOT ================= */
  const handleEditBot = (bot) => {
    formRef.current = { ...bot };

    openConfirm({
      title: "✏️ Bot bewerken",
      description: (
        <AddBotForm
          initialForm={formRef.current}
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

  /* ================= DELETE BOT ================= */
  const handleDeleteBot = (bot) => {
    openConfirm({
      title: "🗑 Bot verwijderen",
      tone: "danger",
      description: <>Weet je zeker dat <b>{bot.name}</b> weg mag?</>,
      confirmText: "Verwijderen",
      onConfirm: async () => {
        await deleteBot(bot.id);
        if (activeBotId === bot.id) {
          setActiveBotId(configs[0]?.id ?? null);
        }
        showSnackbar("Bot verwijderd", "success");
      },
    });
  };

  /* ================= PAGE ================= */
  return (
    <div className="space-y-8 animate-fade-slide">
      {/* ===== TITLE ===== */}
      <div className="flex items-center gap-3">
        <BotIcon className="w-6 h-6 text-[var(--accent)]" />
        <h1 className="text-2xl font-semibold">Trading Bots</h1>
      </div>

      {/* ===== TODAY ===== */}
      <BotDecisionCard
        decision={decision}
        loading={loading.today}
        onGenerate={runBotToday}
      />

      {/* ===== BOTS GRID ===== */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {configs.map((bot) => (
          <BotCard
            key={bot.id}
            bot={bot}
            isActive={bot.id === activeBotId}
            onSelect={() => setActiveBotId(bot.id)}
            onEdit={handleEditBot}
            onDelete={handleDeleteBot}
            onRun={() => runBotToday(bot.id)}
          />
        ))}

        {/* ADD BOT CARD */}
        <button
          onClick={handleAddBot}
          className="rounded-xl border border-dashed border-[var(--border)] p-6
                     text-sm text-muted hover:border-[var(--accent)]"
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
