"use client";

import { useRef } from "react";
import {
  Brain,
  SlidersHorizontal,
  Bot as BotIcon,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useModal } from "@/components/modal/ModalProvider";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotScores from "@/components/bot/BotScores";
import BotRules from "@/components/bot/BotRules";
import BotRulesEditor from "@/components/bot/BotRulesEditor";
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
     🧠 FORM REFS
  ===================================================== */
  const formRef = useRef({
    name: "",
    bot_type: "dca",
    symbol: "BTC",
    mode: "manual",
  });

  const rulesRef = useRef([]);

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

  const activeBot =
    configs.find((b) => b.is_active) ?? configs[0] ?? null;

  /* =====================================================
     ➕ CREATE BOT
  ===================================================== */
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
          bot_type: p.bot_type,
          symbol: p.symbol,
          mode: p.mode,
          is_active: true,
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
      bot_type: bot.bot_type,
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
        await updateBot(bot.id, {
          ...formRef.current,
          is_active: bot.is_active,
        });

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
     🧠 EDIT RULES (FRONTEND ONLY)
  ===================================================== */
  const handleEditRules = () => {
    if (!activeBot) return;

    rulesRef.current = activeBot.rules || [];

    openConfirm({
      title: "🧠 Bot rules",
      description: (
        <BotRulesEditor
          initialRules={rulesRef.current}
          onChange={(r) => {
            rulesRef.current = r;
          }}
        />
      ),
      confirmText: "Opslaan",
      cancelText: "Annuleren",
      onConfirm: async () => {
        console.log("Rules save (frontend only):", rulesRef.current);

        // 🔜 later:
        // await updateBot(activeBot.id, { rules: rulesRef.current })

        showSnackbar("Rules opgeslagen", "success");
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
        {/* ===== BOTS ===== */}
        <CardWrapper title="Bots" icon={<Brain className="icon" />}>
          <div className="space-y-2">
            {configs.map((bot) => {
              const isActive = bot.id === activeBot?.id;

              return (
                <div
                  key={bot.id}
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    isActive
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--card-border)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted" />
                    )}
                    <span className="font-medium">
                      {bot.name}{" "}
                      <span className="text-xs opacity-60">
                        ({bot.bot_type.toUpperCase()})
                      </span>
                    </span>
                  </div>

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
              );
            })}

            <button className="btn-secondary mt-2" onClick={handleAddBot}>
              ➕ Nieuwe bot
            </button>
          </div>
        </CardWrapper>

        {/* ===== MODE ===== */}
        <CardWrapper title="Mode" icon={<SlidersHorizontal className="icon" />}>
          <div className="space-y-2 text-sm">
            <div
              className={`p-2 rounded border ${
                activeBot?.mode === "manual"
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                  : "border-[var(--card-border)]"
              }`}
            >
              <b>Manual</b> – Alleen beslissingen, jij voert uit
            </div>

            <div className="p-2 rounded border opacity-60">
              <b>Semi-auto</b> – Orders klaarzetten (binnenkort)
            </div>

            <div className="p-2 rounded border opacity-60">
              <b>Auto</b> – Volledig automatisch (exchanges vereist)
            </div>
          </div>
        </CardWrapper>
      </div>

      {/* ================= SCORES ================= */}
      <BotScores scores={decision?.scores || {}} loading={loading.today} />

      {/* ================= RULES ================= */}
      <BotRules
        rules={activeBot?.rules || []}
        loading={loading.configs}
        onEdit={handleEditRules}
      />

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
