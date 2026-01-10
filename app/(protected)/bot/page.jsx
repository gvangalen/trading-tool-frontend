"use client";

import { useRef } from "react";
import {
  Brain,
  SlidersHorizontal,
  Bot as BotIcon,
  Pencil,
  Trash2,
} from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useModal } from "@/components/modal/ModalProvider";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotScores from "@/components/bot/BotScores";
import BotRules from "@/components/bot/BotRules";
import BotOrderPreview from "@/components/bot/BotOrderPreview";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import AddBotForm from "@/components/bot/AddBotForm";

import CardWrapper from "@/components/ui/CardWrapper";

export default function BotPage() {
  /* =====================================================
     🧠 MODAL / SNACKBAR
  ===================================================== */
  const { openConfirm, showSnackbar } = useModal();

  /* =====================================================
     🧠 FORM REF (voor create & edit)
  ===================================================== */
  const formRef = useRef({
    name: "",
    symbol: "BTC",
    mode: "manual",
  });

  /* =====================================================
     🧠 DATA (CENTRALE HOOK)
  ===================================================== */
  const {
    configs = [],
    today = null,
    history = [],
    loading,
    createBot,
    updateBot,
    deleteBot,
    runBotToday,
    executeBot,
    skipBot,
  } = useBotData();

  const decision = today?.decisions?.[0] ?? null;
  const order = today?.orders?.[0] ?? null;
  const activeBot = configs?.[0] ?? null;

  /* =====================================================
     ➕ CREATE BOT
  ===================================================== */
  const handleAddBot = () => {
    formRef.current = { name: "", symbol: "BTC", mode: "manual" };

    openConfirm({
      title: "➕ Nieuwe bot",
      description: (
        <AddBotForm
          initialForm={formRef.current}
          onChange={(data) => (formRef.current = data)}
        />
      ),
      confirmText: "Opslaan",
      onConfirm: async () => {
        const p = formRef.current;

        if (!p.name || p.name.trim().length < 2) {
          showSnackbar("Botnaam is verplicht", "danger");
          return;
        }

        await createBot({
          name: p.name.trim(),
          symbol: p.symbol,
          mode: p.mode,
          active: true,
        });

        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  /* =====================================================
     ✏️ EDIT BOT
  ===================================================== */
  const handleEditBot = (bot) => {
    formRef.current = {
      name: bot.name,
      symbol: bot.symbol,
      mode: bot.mode,
    };

    openConfirm({
      title: "✏️ Bot aanpassen",
      description: (
        <AddBotForm
          initialForm={formRef.current}
          onChange={(data) => (formRef.current = data)}
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
  const handleDeleteBot = (bot) => {
    openConfirm({
      title: "🗑 Bot verwijderen",
      tone: "danger",
      description: (
        <p>
          Weet je zeker dat je <b>{bot.name}</b> wilt verwijderen?
        </p>
      ),
      confirmText: "Verwijderen",
      onConfirm: async () => {
        await deleteBot(bot.id);
        showSnackbar("Bot verwijderd", "success");
      },
    });
  };

  /* =====================================================
     🧠 PAGE
  ===================================================== */
  return (
    <div className="space-y-8 animate-fade-slide">
      {/* ================= TITLE ================= */}
      <div className="flex items-center gap-3">
        <BotIcon className="w-6 h-6 text-[var(--accent)]" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Trading Bots
        </h1>
      </div>

      {/* ================= TODAY ================= */}
      <BotDecisionCard
        decision={decision}
        loading={loading.today}
        onGenerate={runBotToday}
      />

      {/* ================= CONFIG ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        <CardWrapper title="Bots" icon={<Brain className="icon" />}>
          {configs.length === 0 ? (
            <button className="btn-primary" onClick={handleAddBot}>
              ➕ Bot toevoegen
            </button>
          ) : (
            <div className="space-y-2">
              {configs.map((bot) => (
                <div
                  key={bot.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-[var(--card-border)]"
                >
                  <span className="font-medium">{bot.name}</span>

                  <div className="flex gap-2">
                    <button
                      className="btn-icon"
                      onClick={() => handleEditBot(bot)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon text-red-500"
                      onClick={() => handleDeleteBot(bot)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <button className="btn-secondary mt-2" onClick={handleAddBot}>
                ➕ Nieuwe bot
              </button>
            </div>
          )}
        </CardWrapper>

        <CardWrapper title="Mode" icon={<SlidersHorizontal className="icon" />}>
          <p className="text-sm text-[var(--text-muted)]">
            Auto-mode volgt zodra exchanges gekoppeld zijn.
          </p>
        </CardWrapper>
      </div>

      {/* ================= SCORES ================= */}
      <BotScores scores={decision?.scores || {}} loading={loading.today} />

      {/* ================= RULES ================= */}
      <BotRules rules={activeBot?.rules || []} />

      {/* ================= ORDER ================= */}
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

      {/* ================= HISTORY ================= */}
      <BotHistoryTable history={history} loading={loading.history} />
    </div>
  );
}
