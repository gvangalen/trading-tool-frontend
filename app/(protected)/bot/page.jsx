"use client";

import { useEffect, useRef, useState } from "react";
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
     ✅ ACTIVE BOT (UI selection)
  ===================================================== */
  const [activeBotId, setActiveBotId] = useState(null);

  /* =====================================================
     ✅ LOCAL RULES (UI-first, zodat je DIRECT verschil ziet)
     - backend kan later (of nu al) syncen
  ===================================================== */
  const [localRulesByBotId, setLocalRulesByBotId] = useState({});

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

  // ✅ kies default active bot (1x) zodra configs geladen zijn
  useEffect(() => {
    if (!activeBotId && configs.length > 0) {
      const preferred =
        configs.find((b) => b.is_active)?.id ?? configs[0].id;
      setActiveBotId(preferred);
    }
  }, [configs, activeBotId]);

  // ✅ echte selected bot (UI selection is leading)
  const activeBot =
    configs.find((b) => b.id === activeBotId) ??
    configs.find((b) => b.is_active) ??
    configs[0] ??
    null;

  // ✅ rules die je toont: eerst local override, anders backend value
  const activeBotRules =
    (activeBot?.id && localRulesByBotId?.[activeBot.id]) ??
    activeBot?.rules ??
    [];

  // (voor nu) today/decision/order zijn nog “globaal”
  const decision = today?.decisions?.[0] ?? null;
  const order = today?.orders?.[0] ?? null;

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

        const res = await createBot({
          name: p.name.trim(),
          bot_type: p.bot_type,
          symbol: p.symbol,
          mode: p.mode,
          is_active: true,
        });

        // ✅ selecteer net aangemaakte bot (als backend id teruggeeft)
        const newId = res?.bot_id ?? res?.id ?? null;
        if (newId) setActiveBotId(newId);

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

        // ✅ ruim local rules op
        setLocalRulesByBotId((prev) => {
          const next = { ...prev };
          delete next[bot.id];
          return next;
        });

        // ✅ als je actieve bot delete → selecteer volgende
        if (activeBotId === bot.id) {
          const remaining = configs.filter((b) => b.id !== bot.id);
          setActiveBotId(remaining[0]?.id ?? null);
        }

        showSnackbar("Bot verwijderd", "success");
      },
    });
  };

  /* =====================================================
     🧠 EDIT RULES (per selected bot) — UI FIRST + backend sync
  ===================================================== */
  const handleEditRules = () => {
    if (!activeBot) return;

    // ✅ pak de rules die we NU tonen (local override > backend)
    rulesRef.current = Array.isArray(activeBotRules) ? activeBotRules : [];

    openConfirm({
      title: `🧠 Rules – ${activeBot.name}`,
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
        // ✅ 1) DIRECT zichtbaar in UI (altijd)
        setLocalRulesByBotId((prev) => ({
          ...prev,
          [activeBot.id]: rulesRef.current,
        }));

        // ✅ 2) Probeer backend sync (als backend rules accepteert)
        //    - Als backend het (nog) negeert: UI blijft alsnog correct (local)
        try {
          await updateBot(activeBot.id, {
            rules: rulesRef.current,
            is_active: activeBot.is_active,
            name: activeBot.name,
            bot_type: activeBot.bot_type,
            symbol: activeBot.symbol,
            mode: activeBot.mode,
          });
        } catch (e) {
          console.warn("⚠️ Backend rules save failed (UI blijft local):", e);
        }

        showSnackbar("Rules opgeslagen", "success");
      },
    });
  };

  /* =====================================================
     ✅ UX: duidelijke selecteer-flow
     - Klik op rij = selecteren
     - Extra hint bovenaan
  ===================================================== */
  const handleSelectBot = (botId) => {
    setActiveBotId(botId);
    // (optioneel) kleine feedback, maar niet spammen
    // showSnackbar("Bot geselecteerd", "success");
  };

  /* =====================================================
     🧠 PAGE
  ===================================================== */
  return (
    <div className="space-y-8 animate-fade-slide">
      {/* ================= TITLE ================= */}
      <div className="flex items-center gap-3">
        <BotIcon className="w-6 h-6 text-[var(--accent)]" />
        <h1 className="text-2xl font-semibold tracking-tight">Trading Bots</h1>
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
            <p className="text-xs text-[var(--text-muted)]">
              Klik op een bot om te selecteren. De geselecteerde bot bepaalt
              welke rules hieronder worden getoond en bewerkt.
            </p>

            {configs.map((bot) => {
              const isSelected = bot.id === activeBot?.id;

              return (
                <div
                  key={bot.id}
                  onClick={() => handleSelectBot(bot.id)}
                  className={`cursor-pointer flex items-center justify-between p-2 rounded-lg border ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--card-border)]"
                  }`}
                  title="Klik om deze bot te selecteren"
                >
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted" />
                    )}

                    <div className="flex flex-col leading-tight">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {bot.name}{" "}
                          <span className="text-xs opacity-60">
                            ({String(bot.bot_type || "").toUpperCase()})
                          </span>
                        </span>

                        {isSelected && (
                          <span className="text-[10px] px-2 py-[2px] rounded-full border border-[var(--accent)] text-[var(--accent)]">
                            geselecteerd
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-[var(--text-muted)]">
                        Asset: {bot.symbol} • Mode: {bot.mode}
                      </span>
                    </div>
                  </div>

                  {/* ✅ stop propagation zodat click op icons niet óók select triggert */}
                  <div className="flex gap-2">
                    <button
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBot(bot);
                      }}
                      title="Bewerken"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="btn-icon text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBot(bot);
                      }}
                      title="Verwijderen"
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

      {/* ================= RULES (per selected bot) ================= */}
      <div className="space-y-3">
        {/* Extra duidelijke context boven rules */}
        <div className="text-xs text-[var(--text-muted)]">
          Geselecteerde bot:{" "}
          <span className="font-medium text-[var(--text)]">
            {activeBot ? activeBot.name : "—"}
          </span>
          {activeBot?.bot_type ? (
            <span className="ml-2 opacity-70">
              ({String(activeBot.bot_type).toUpperCase()})
            </span>
          ) : null}
        </div>

        <BotRules
          rules={activeBotRules}
          loading={loading.configs}
          onEdit={handleEditRules}
        />
      </div>

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
