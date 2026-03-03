"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Wallet, Plus } from "lucide-react";

import useBotData from "@/hooks/useBotData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useModal } from "@/components/modal/ModalProvider";

import BotAgentCard from "@/components/bot/BotAgentCard";
import BotScores from "@/components/bot/BotScores";
import BotForm from "@/components/bot/AddBotForm";
import BotBudgetForm from "@/components/bot/BotBudgetForm";
import BotPortfolioOverview from "@/components/bot/BotPortfolioOverview";
import PortfolioBalanceCard from "@/components/bot/PortfolioBalanceCard";

// ✅ NEW (global active bot)
import {
  ActiveBotProvider,
  useActiveBot,
} from "@/context/ActiveBotContext";

// ✅ NEW (global trade panel right column)
import GlobalTradePanel from "@/components/bot/GlobalTradePanel";

/**
 * BotPage — TradeLayer 2.6 (GLOBAL TRADE PANEL)
 *
 * - 1 TradePanel rechts voor alle bots
 * - Active bot via context
 * - Bot cards zijn puur info/select (geen trade panel per bot)
 */
export default function BotPage() {
  return (
    <ActiveBotProvider>
      <BotPageInner />
    </ActiveBotProvider>
  );
}

/* =====================================================
   INNER (zodat we useActiveBot kunnen gebruiken)
===================================================== */
function BotPageInner() {
  /* =====================================================
     🧠 MODAL / FEEDBACK
  ===================================================== */
  const { openConfirm, showSnackbar } = useModal();
  const formRef = useRef({});
  const budgetRef = useRef({});

  /* =====================================================
     🧠 ACTIVE BOT (GLOBAL)
  ===================================================== */
  const { activeBot, setActiveBot } = useActiveBot();

  /* =====================================================
     🧠 UI STATE
  ===================================================== */
  const [generatingBotId, setGeneratingBotId] = useState(null);
  const [executingBotId, setExecutingBotId] = useState(null);
  const [placingOrderBotId, setPlacingOrderBotId] = useState(null);

  /* =====================================================
     🤖 BOT DATA (BACKEND LEIDEND)
  ===================================================== */
  const {
    configs: bots = [],
    today,
    history = [],
    portfolios = [],
    decisionsByBot = {},
    tradesByBot = {},
    loading,

    createBot,
    updateBot,
    deleteBot,
    updateBudgetForBot,

    generateDecisionForBot,
    executeBot,
    skipBot,

    saveTradePlanForDecision,
    createManualOrder,
  } = useBotData();

  /* =====================================================
     🧠 STRATEGIES
  ===================================================== */
  const { strategies = [], loadStrategies } = useStrategyData();

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  /* =====================================================
     ✅ AUTO-SELECT FIRST BOT (nice UX)
  ===================================================== */
  useEffect(() => {
    if (activeBot?.id) return;
    if (!Array.isArray(bots) || bots.length === 0) return;
    setActiveBot(bots[0]);
  }, [bots, activeBot?.id, setActiveBot]);

  /* =====================================================
     🌍 GLOBAL SCORES
  ===================================================== */
  const dailyScores = today?.scores ?? {
    macro: 10,
    technical: 10,
    market: 10,
    setup: 10,
  };

  /* =====================================================
     🧩 MERGE bots + portfolio (voor overview)
  ===================================================== */
  const aggregatedBotsForOverview = useMemo(() => {
    return (bots || []).map((bot) => {
      const p = (portfolios || []).find((x) => x.bot_id === bot.id);
      return {
        bot_id: bot.id,
        symbol: p?.symbol ?? bot?.symbol ?? "—",
        budget: p?.budget ?? {},
        stats: p?.stats ?? {},
      };
    });
  }, [bots, portfolios]);

  /* =====================================================
     📈 PORTFOLIO BALANCE (ALL BOTS)
  ===================================================== */
  const totalPortfolioValueEur = useMemo(() => {
    return (portfolios || []).reduce((acc, p) => {
      const v = Number(p?.stats?.position_value_eur ?? 0);
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [portfolios]);

  const portfolioBalanceDataByRange = useMemo(() => {
    const byRange =
      today?.portfolio_balance_by_range ||
      today?.portfolio_balance_history_by_range ||
      null;

    if (byRange && typeof byRange === "object") {
      const normalizeSeries = (series) =>
        (Array.isArray(series) ? series : [])
          .map((p) => ({
            ts: p?.ts || p?.timestamp || p?.date || null,
            value_eur: Number(
              p?.value_eur ??
                p?.value ??
                p?.balance_eur ??
                p?.portfolio_value_eur ??
                0
            ),
          }))
          .filter((p) => p.ts && Number.isFinite(p.value_eur));

      return {
        "1D": normalizeSeries(byRange["1D"]),
        "1W": normalizeSeries(byRange["1W"]),
        "1M": normalizeSeries(byRange["1M"]),
        "1Y": normalizeSeries(byRange["1Y"]),
        ALL: normalizeSeries(byRange["ALL"] || byRange["all"]),
      };
    }

    const detected = (Array.isArray(history) ? history : [])
      .map((p) => {
        const ts = p?.ts || p?.timestamp || p?.date || null;
        const v =
          p?.portfolio_value_eur ??
          p?.total_value_eur ??
          p?.value_eur ??
          p?.balance_eur ??
          null;
        const value_eur = Number(v);
        return {
          ts,
          value_eur: Number.isFinite(value_eur) ? value_eur : null,
        };
      })
      .filter((p) => p.ts && p.value_eur !== null);

    if (detected.length >= 2) {
      return { "1D": detected, "1W": detected, "1M": detected, "1Y": detected, ALL: detected };
    }

    const now = new Date().toISOString();
    const single = [{ ts: now, value_eur: totalPortfolioValueEur }];
    return { "1D": single, "1W": single, "1M": single, "1Y": single, ALL: single };
  }, [today, history, totalPortfolioValueEur]);

  /* =====================================================
     🔁 GENERATE DECISION
  ===================================================== */
  const handleGenerateDecision = async (bot) => {
    try {
      setGeneratingBotId(bot.id);
      await generateDecisionForBot({ bot_id: bot.id });
      showSnackbar(`Nieuw voorstel voor ${bot.name}`, "success");
    } catch {
      showSnackbar("Fout bij genereren voorstel", "danger");
    } finally {
      setGeneratingBotId(null);
    }
  };

  /* =====================================================
     💾 SAVE TRADE PLAN
  ===================================================== */
  const handleSaveTradePlan = async ({ bot_id, decision_id, draft }) => {
    if (!saveTradePlanForDecision) {
      showSnackbar("Save handler ontbreekt (hook)", "danger");
      return;
    }

    try {
      await saveTradePlanForDecision({ bot_id, decision_id, draft });
      showSnackbar("Trade plan opgeslagen", "success");
    } catch (e) {
      console.error(e);
      showSnackbar("Opslaan trade plan mislukt", "danger");
      throw e;
    }
  };

  /* =====================================================
     🔥 MANUAL PAPER TRADE (GLOBAL PANEL calls this via BotAgentCard props OR directly later)
  ===================================================== */
  const handleManualTrade = async (payload) => {
    if (!createManualOrder) {
      showSnackbar("createManualOrder ontbreekt (hook)", "danger");
      return;
    }

    try {
      setPlacingOrderBotId(payload?.bot_id ?? null);
      await createManualOrder(payload);
      showSnackbar("Paper trade geplaatst", "success");
    } catch (e) {
      console.error(e);
      showSnackbar("Paper trade mislukt", "danger");
      throw e;
    } finally {
      setPlacingOrderBotId(null);
    }
  };

  /* =====================================================
     ▶️ EXECUTE BOT
  ===================================================== */
  const handleExecuteBot = async ({ bot_id }) => {
    try {
      setExecutingBotId(bot_id);

      const decision = decisionsByBot?.[bot_id] ?? null;
      const decision_id = decision?.id ?? decision?.decision_id ?? null;

      if (!decision_id) {
        showSnackbar("Geen decision_id gevonden om uit te voeren", "danger");
        return;
      }

      await executeBot({ bot_id, decision_id });

      const bot = (bots || []).find((b) => b.id === bot_id);
      showSnackbar(`${bot?.name ?? "Bot"} uitgevoerd`, "success");
    } catch {
      showSnackbar("Uitvoeren mislukt", "danger");
    } finally {
      setExecutingBotId(null);
    }
  };

  /* =====================================================
     ⏭️ SKIP BOT
  ===================================================== */
  const handleSkipBot = async ({ bot_id }) => {
    try {
      setExecutingBotId(bot_id);
      await skipBot({ bot_id });

      const bot = (bots || []).find((b) => b.id === bot_id);
      showSnackbar(`${bot?.name ?? "Bot"} overgeslagen`, "info");
    } catch {
      showSnackbar("Overslaan mislukt", "danger");
    } finally {
      setExecutingBotId(null);
    }
  };

  /* =====================================================
     ➕ ADD BOT
  ===================================================== */
  const handleAddBot = () => {
    formRef.current = {};

    openConfirm({
      title: "➕ Nieuwe bot",
      description: (
        <BotForm
          strategies={strategies}
          onChange={(v) => (formRef.current = v)}
        />
      ),
      confirmText: "Bot toevoegen",
      onConfirm: async () => {
        if (!formRef.current?.name || !formRef.current?.strategy_id) {
          showSnackbar("Vul alle velden in", "danger");
          return;
        }

        await createBot(formRef.current);
        showSnackbar("Bot toegevoegd", "success");
      },
    });
  };

  /* =====================================================
     ⚙️ BOT SETTINGS ROUTER
  ===================================================== */
  const handleOpenBotSettings = (type, bot) => {
    if (!bot) return;

    switch (type) {
      case "general":
        formRef.current = {};
        openConfirm({
          title: `⚙️ Bot instellingen – ${bot.name}`,
          description: (
            <BotForm
              initialData={bot}
              strategies={strategies}
              onChange={(v) => (formRef.current = v)}
            />
          ),
          confirmText: "Opslaan",
          onConfirm: async () => {
            await updateBot(bot.id, formRef.current);
            showSnackbar("Bot bijgewerkt", "success");
          },
        });
        break;

      case "portfolio": {
        const portfolio = (portfolios || []).find((p) => p.bot_id === bot.id);
        if (!portfolio) {
          showSnackbar("Geen portfolio gevonden voor bot", "danger");
          return;
        }

        budgetRef.current = {
          total_eur: portfolio.budget?.total_eur ?? 0,
          daily_limit_eur: portfolio.budget?.daily_limit_eur ?? 0,
          min_order_eur: portfolio.budget?.min_order_eur ?? 0,
          max_order_eur: portfolio.budget?.max_order_eur ?? 0,
        };

        openConfirm({
          title: `💰 Bot budget – ${bot.name}`,
          description: (
            <BotBudgetForm
              initialBudget={budgetRef.current}
              onChange={(v) => (budgetRef.current = v)}
            />
          ),
          confirmText: "Opslaan",
          onConfirm: async () => {
            await updateBudgetForBot(bot.id, budgetRef.current);
            showSnackbar("Bot budget bijgewerkt", "success");
          },
        });
        break;
      }

      case "pause":
        openConfirm({
          title: "⏸️ Bot pauzeren",
          confirmText: "Pauzeren",
          onConfirm: async () => {
            await updateBot(bot.id, { is_active: false });
            showSnackbar("Bot gepauzeerd", "info");
          },
        });
        break;

      case "resume":
        openConfirm({
          title: "▶️ Bot hervatten",
          confirmText: "Hervatten",
          onConfirm: async () => {
            await updateBot(bot.id, { is_active: true });
            showSnackbar("Bot hervat", "success");
          },
        });
        break;

      case "delete":
        openConfirm({
          title: "🗑️ Bot verwijderen",
          confirmText: "Verwijderen",
          confirmVariant: "danger",
          onConfirm: async () => {
            await deleteBot(bot.id);
            showSnackbar("Bot verwijderd", "danger");
          },
        });
        break;

      default:
        break;
    }
  };

  /* =====================================================
     🧠 PAGE LAYOUT (2 COLUMNS)
  ===================================================== */
  return (
    <div className="bg-[var(--bg)] pt-6 pb-10 animate-fade-slide">
      <div className="max-w-[1400px] mx-auto px-4 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Wallet className="icon icon-primary" />
          <h1 className="text-2xl font-semibold">Portfolio Management</h1>
        </div>

        {/* Top: global scores + balance + overview */}
        <BotScores scores={dailyScores} loading={loading?.today} />

        <PortfolioBalanceCard
          title="Portfolio balance"
          defaultRange="1W"
          dataByRange={portfolioBalanceDataByRange}
        />

        <BotPortfolioOverview bots={aggregatedBotsForOverview} />

        {/* Bots header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bots</h2>
          <button
            onClick={handleAddBot}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Nieuwe bot
          </button>
        </div>

        {/* 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
          {/* LEFT: bot cards */}
          <div className="space-y-6">
            {(bots || []).map((bot) => {
              const portfolio =
                (portfolios || []).find((p) => p.bot_id === bot.id) ?? null;
              const decision = decisionsByBot?.[bot.id] ?? null;
              const trades = tradesByBot?.[bot.id] ?? [];

              const isLoadingThisBot =
                generatingBotId === bot.id ||
                executingBotId === bot.id ||
                placingOrderBotId === bot.id;

              const isActive = activeBot?.id === bot.id;

              return (
                <div
                  key={bot.id}
                  onClick={() => setActiveBot(bot)}
                  className={`cursor-pointer transition ${
                    isActive ? "ring-2 ring-[var(--primary)] rounded-[var(--radius-lg)]" : ""
                  }`}
                >
                  <BotAgentCard
                    bot={bot}
                    decision={decision}
                    portfolio={portfolio}
                    trades={trades}
                    history={history ?? []}
                    loadingDecision={isLoadingThisBot}
                    onGenerate={() => handleGenerateDecision(bot)}
                    onExecute={handleExecuteBot}
                    onSkip={handleSkipBot}
                    onOpenSettings={handleOpenBotSettings}
                    onSaveTradePlan={handleSaveTradePlan}
                    // ✅ later: trade panel calls this; for now keep wiring consistent
                    onPlaceManualOrder={handleManualTrade}
                  />
                </div>
              );
            })}
          </div>

          {/* RIGHT: one global trade panel */}
          <div className="lg:sticky lg:top-6 space-y-4">
            <GlobalTradePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
