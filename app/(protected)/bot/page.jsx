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

/**
 * BotPage — TradeLayer 2.6 (COMPLETE / WIRED)
 *
 * - Backend = single source of truth
 * - Trades komen EXCLUSIEF uit bot_ledger
 * - UI is puur renderlaag
 *
 * Updates:
 * ✅ saveTradePlanForDecision wiring (BotAgentCard -> BotPage -> hook)
 * ✅ createManualOrder wiring (BotAgentCard -> BotPage -> hook)
 * ✅ placingOrderBotId loading state
 * ✅ handleOpenBotSettings aanwezig (crash fix)
 */
export default function BotPage() {
  /* =====================================================
     🧠 MODAL / FEEDBACK
  ===================================================== */
  const { openConfirm, showSnackbar } = useModal();
  const formRef = useRef({});
  const budgetRef = useRef({});

  /* =====================================================
     🧠 UI STATE
  ===================================================== */
  const [generatingBotId, setGeneratingBotId] = useState(null);
  const [executingBotId, setExecutingBotId] = useState(null);
  const [placingOrderBotId, setPlacingOrderBotId] = useState(null); // 🔥 NEW

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

    // ✅ save trade plan
    saveTradePlanForDecision,

    // ✅ manual paper trade (moet bestaan in hook)
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

    // fallback: probeer uit history te detecteren (oude payloads)
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
      return {
        "1D": detected,
        "1W": detected,
        "1M": detected,
        "1Y": detected,
        ALL: detected,
      };
    }

    // fallback: single point
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
     🔥 MANUAL PAPER TRADE
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
     ▶️ EXECUTE BOT (decision_id meegeven)
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
     ⚙️ BOT SETTINGS ROUTER (BELANGRIJK!)
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
     🧠 PAGE
  ===================================================== */
  return (
    <div className="bg-[var(--bg)] pt-6 pb-10 space-y-10 animate-fade-slide">
      <div className="flex items-center gap-3">
        <Wallet className="icon icon-primary" />
        <h1 className="text-2xl font-semibold">Portfolio Management</h1>
      </div>

      <BotScores scores={dailyScores} loading={loading?.today} />

      <PortfolioBalanceCard
        title="Portfolio balance"
        defaultRange="1W"
        dataByRange={portfolioBalanceDataByRange}
      />

      <BotPortfolioOverview bots={aggregatedBotsForOverview} />

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

      <div className="space-y-6">
        {(bots || []).map((bot) => {
          const portfolio = (portfolios || []).find((p) => p.bot_id === bot.id) ?? null;
          const decision = decisionsByBot?.[bot.id] ?? null;
          const trades = tradesByBot?.[bot.id] ?? [];

          const isLoadingThisBot =
            generatingBotId === bot.id ||
            executingBotId === bot.id ||
            placingOrderBotId === bot.id;

          return (
            <BotAgentCard
              key={bot.id}
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
              onPlaceManualOrder={handleManualTrade}
            />
          );
        })}
      </div>
    </div>
  );
}
