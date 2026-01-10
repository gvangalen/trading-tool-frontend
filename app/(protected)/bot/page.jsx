"use client";

import { useRef } from "react";
import {
  Brain,
  SlidersHorizontal,
  Bot as BotIcon,
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
     🧠 FORM REF
     → ModalProvider rendert JSX maar beheert geen state
  ===================================================== */
  const formRef = useRef({
    name: "",
    symbol: "BTC",
    mode: "manual",
  });

  /* =====================================================
     🧠 DATA (CENTRAAL)
  ===================================================== */
  const {
    configs = [],
    today = null,
    history = [],
    loading,
    createBot,      // ✅ ENIGE manier om bot te maken
    runBotToday,
    executeBot,
    skipBot,
  } = useBotData();

  const decision = today?.decisions?.[0] ?? null;
  const order = today?.orders?.[0] ?? null;
  const activeBot = configs?.[0] ?? null;

  /* =====================================================
     ➕ BOT TOEVOEGEN
  ===================================================== */
  const handleAddBot = () => {
    // reset bij openen
    formRef.current = {
      name: "",
      symbol: "BTC",
      mode: "manual",
    };

    openConfirm({
      title: "➕ Nieuwe bot",
      description: (
        <AddBotForm
          initialForm={formRef.current}
          onChange={(data) => {
            formRef.current = data;
          }}
        />
      ),
      confirmText: "Opslaan",
      cancelText: "Annuleren",

      onConfirm: async () => {
        const payload = formRef.current;

        if (!payload.name || payload.name.trim().length < 2) {
          showSnackbar("Botnaam is verplicht", "danger");
          return;
        }

        try {
          await createBot({
            name: payload.name.trim(),
            symbol: payload.symbol,
            mode: payload.mode,
            active: true,
          });

          showSnackbar("Bot succesvol toegevoegd", "success");
        } catch (e) {
          showSnackbar(e.message || "Bot aanmaken mislukt", "danger");
          throw e;
        }
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
        onGenerate={() => runBotToday()}
      />

      {/* ================= CONFIG ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        <CardWrapper title="Bot" icon={<Brain className="icon" />}>
          {configs.length === 0 ? (
            <button className="btn-primary" onClick={handleAddBot}>
              ➕ Bot toevoegen
            </button>
          ) : (
            <>
              <select disabled className="input opacity-70">
                {configs.map((bot) => (
                  <option key={bot.id}>{bot.name}</option>
                ))}
              </select>

              <button
                className="btn-secondary mt-3"
                onClick={handleAddBot}
              >
                ➕ Nieuwe bot
              </button>
            </>
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
