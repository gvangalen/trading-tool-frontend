"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import BotSettingsMenu from "@/components/bot/BotSettingsMenu";
import TradePlanCard from "@/components/bot/TradePlanCard";
import MarketDecisionCard from "@/components/bot/MarketDecisionCard";
import GuardrailsPanel from "@/components/bot/GuardrailsPanel";

import {
  Bot,
  MoreVertical,
  Clock,
  Shield,
  Scale,
  Rocket,
  Activity,
} from "lucide-react";

export default function BotAgentCard({
  bot,
  decision,
  order,
  portfolio,
  history = [],
  trades = [],
  loadingDecision = false,

  marketIntelligence,
  loadingMarketIntelligence = false,

  onGenerate,
  onExecute,
  onSkip,
  onOpenSettings,

  onSaveTradePlan,
}) {
  if (!bot) return null;

  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  const [savingPlan, setSavingPlan] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const isAuto = bot?.mode === "auto";

  /* ================= SAFE BASE DATA ================= */

  const safeDecision = decision || {};
  const safeOrder = order || {};

  const symbol = (
    bot?.strategy?.setup?.symbol ||
    bot?.strategy?.symbol ||
    bot?.symbol ||
    safeDecision?.symbol ||
    "BTC"
  ).toUpperCase();

  const timeframe =
    bot?.strategy?.setup?.timeframe ||
    bot?.strategy?.timeframe ||
    bot?.timeframe ||
    "—";

  const statusLabel = (safeDecision?.action || "OBSERVE").toUpperCase();

  const confidence =
    safeDecision?.confidence_label ||
    safeDecision?.confidence ||
    "LOW";

  /* ================= BOT STATE ================= */
  const normalizedAction = String(safeDecision?.action || "").toLowerCase();

  const botState = bot?.is_active
    ? normalizedAction === "hold" || normalizedAction === "observe" || !normalizedAction
      ? "waiting"
      : "live"
    : "paused";

  const lastRun =
    bot?.last_run
      ? new Date(bot.last_run).toLocaleTimeString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  /* ================= DEBUG ================= */
  useEffect(() => {
    console.log("🤖 BOT", bot);
    console.log("📊 DECISION RAW", decision);
    console.log("📦 SCORES_JSON", normalizedDecision?.scores_json);
    console.log("🛡 GUARDRAILS RAW", decision?.guardrails_result);
    console.log("🧭 TRADE PLAN RAW", decision?.trade_plan);
  }, [bot, decision]);

  /* ================= REFRESH ON BUDGET UPDATE ================= */
  useEffect(() => {
    const handleBudgetUpdate = () => {
      console.log("🔄 Budget updated → refreshing bot decision");
      onGenerate?.(bot);
    };

    window.addEventListener("bot:budget-updated", handleBudgetUpdate);

    return () => {
      window.removeEventListener("bot:budget-updated", handleBudgetUpdate);
    };
  }, [bot, onGenerate]);

  /* ================= NORMALIZE DECISION ================= */
  const normalizedDecision = useMemo(() => {
  const scores = safeDecision?.scores_json || {};
  const guardrails =
    safeDecision?.guardrails_result ||
    safeDecision?.guardrails ||
    {};
  const tradePlan = safeDecision?.trade_plan || {};

  const rawPositionSize =
    safeDecision?.position_size ??
    scores?.position_size ??
    0.5;

  const normalizedPositionSize = Math.max(
    0,
    Math.min(Number(rawPositionSize) || 0.5, 1)
  );

  const normalized = {
    ...safeDecision,

    scores_json: scores,

    guardrails_result: guardrails,
    guardrails: guardrails,

    trade_plan: tradePlan,

    transition_risk:
      scores?.transition_risk ??
      safeDecision?.transition_risk ??
      null,

    market_pressure:
      scores?.market_pressure ??
      safeDecision?.market_pressure ??
      null,

    warnings:
      scores?.warnings ??
      safeDecision?.warnings ??
      [],

    requested_amount_eur:
      safeDecision?.requested_amount_eur ??
      scores?.requested_amount_eur ??
      0,

    amount_eur:
      safeDecision?.amount_eur ??
      scores?.amount_eur ??
      0,

    base_amount:
      safeDecision?.base_amount ??
      scores?.base_amount ??
      safeDecision?.requested_amount_eur ??
      0,

    execution_mode:
      safeDecision?.execution_mode ??
      scores?.execution_mode ??
      "fixed",

    decision_curve_name:
      safeDecision?.decision_curve_name ??
      scores?.decision_curve_name ??
      null,

    setup_match:
      safeDecision?.setup_match ??
      scores?.setup_match ??
      null,

    // ✅ MARKET SUGGESTION / POSITION SIZE
    position_size: normalizedPositionSize,

    // ✅ STRATEGY EXPOSURE BLIJFT APART
    exposure_multiplier:
      safeDecision?.exposure_multiplier ??
      scores?.exposure_multiplier ??
      1,
  };

  return normalized;
}, [safeDecision]);

  /* ================= HISTORY ================= */
  const combinedHistory = useMemo(() => {
    const botHistory = (history || []).filter((h) => h.bot_id === bot.id);

    const tradeAsHistory = (trades || []).map((t) => ({
      id: t.id,
      bot_id: bot.id,
      created_at: t.executed_at,
      date: t.executed_at,
      side: t.side,
      qty: t.qty,
      price: t.price,
      amount_eur: t.amount_eur,
      confidence: t.confidence || null,
      status: "executed",
      symbol: t.symbol,
      mode: t.mode,
      action: t.side,
    }));

    const merged = [...tradeAsHistory, ...botHistory].sort((a, b) => {
      const d1 = new Date(a.created_at || a.date || 0);
      const d2 = new Date(b.created_at || b.date || 0);
      return d2 - d1;
    });

    return merged;
  }, [history, trades, bot.id]);

  /* ================= CLOSE SETTINGS ================= */

  useEffect(() => {
    if (!showSettings) return;

    const handler = (e) => {
      if (!settingsRef.current) return;
      if (settingsRef.current.contains(e.target)) return;
      setShowSettings(false);
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [showSettings]);

  /* ================= RISK BADGE ================= */

  const riskConfig = {
    conservative: {
      label: "Risk: Conservative",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: <Shield size={12} />,
    },
    balanced: {
      label: "Risk: Balanced",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <Scale size={12} />,
    },
    aggressive: {
      label: "Risk: Aggressive",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: <Rocket size={12} />,
    },
  };

  const risk =
    riskConfig[String(bot?.risk_profile || "balanced").toLowerCase()] ||
    riskConfig.balanced;

  /* ================= SAVE TRADE PLAN ================= */

  const decisionId =
    normalizedDecision?.id ??
    normalizedDecision?.decision_id ??
    null;

  const botId =
    normalizedDecision?.bot_id ??
    bot?.id ??
    null;

  const canSavePlan =
    !isAuto &&
    !!onSaveTradePlan &&
    !!decisionId &&
    !!botId;

  const handleSaveTradePlan = async (planDraft) => {
    if (!canSavePlan) return;

    setSaveError(null);
    setSavingPlan(true);

    try {
      await onSaveTradePlan({
        bot_id: botId,
        decision_id: decisionId,
        draft: planDraft,
      });
    } catch (e) {
      console.error("❌ Save plan error", e);
      setSaveError(e?.message || "Opslaan mislukt");
      throw e;
    } finally {
      setSavingPlan(false);
    }
  };

  /* ================= PLAN SOURCE ================= */
  const planSource = useMemo(() => {
    return normalizedDecision?.trade_plan || null;
  }, [normalizedDecision?.trade_plan]);

  
  /* ================= ORDER STATE ================= */
  const hasExecutableTrade = useMemo(() => {
    if (order) return true;

    const action = String(normalizedDecision?.action || "").toLowerCase();
    const amount = Number(normalizedDecision?.amount_eur ?? 0);

    return (action === "buy" || action === "sell" || action === "short") && amount > 0;
  }, [order, normalizedDecision]);

  /* ================= RENDER ================= */

  return (
    <div className="w-full rounded-2xl border bg-white shadow-sm space-y-6 p-6">
      {/* HEADER */}

      <div className="space-y-4 border-b pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bot size={22} />
            </div>

            <div className="text-2xl font-bold">
              {bot?.name}
            </div>
          </div>

          <div className="relative" ref={settingsRef}>
            <button
              className="text-gray-400 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings((v) => !v);
              }}
            >
              <MoreVertical size={20} />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 z-50">
                <BotSettingsMenu
                  onOpen={(type) => {
                    setShowSettings(false);
                    onOpenSettings?.(type, bot);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* SYMBOL + SETUP */}

        <div className="text-sm text-gray-500 space-y-1">
          <div>
            {symbol} · {timeframe}
          </div>

          {bot?.strategy && (
            <div className="text-xs text-gray-400 flex flex-col">
              {bot?.strategy?.setup?.name && (
                <div>
                  Setup: <span className="text-gray-600">{bot.strategy.setup.name}</span>
                </div>
              )}

              {bot?.strategy?.name && (
                <div>
                  Strategy: <span className="text-gray-600">{bot.strategy.name}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RISK + MODE */}

        <div className="flex gap-3 flex-wrap">
          <span
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-semibold ${risk.className}`}
          >
            {risk.icon}
            {risk.label}
          </span>

          <span className="px-3 py-1.5 rounded-lg border text-sm font-semibold bg-blue-50 text-blue-700">
            Mode: {isAuto ? "Auto" : "Manual"}
          </span>
        </div>

        {/* BOT STATUS */}

        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              botState === "live"
                ? "bg-green-500"
                : botState === "waiting"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />

          <span className="capitalize">
            {botState}
          </span>

          {lastRun && (
            <span className="text-gray-400">
              · Last run {lastRun}
            </span>
          )}
        </div>

        {/* DECISION STATUS */}

        <div className="bg-gray-50 border rounded-lg px-4 py-3 flex items-center gap-3 text-sm">
          <Activity size={16} className="text-gray-500" />

          <span className="font-medium text-gray-600">
            Status:
          </span>

          <span className="font-bold">
            {statusLabel}
          </span>

          <span className="text-gray-400">•</span>

          <span>
            Confidence <strong>{confidence}</strong>
          </span>

          {hasExecutableTrade && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-green-700 font-medium">
                Trade ready
              </span>
            </>
          )}
        </div>
      </div>

      {/* Portfolio + Guardrails */}

      <div className="flex flex-col lg:flex-row border rounded-xl overflow-hidden">
        <div className="flex-1 p-5">
          <BotPortfolioCard bot={portfolio} />
        </div>

        <div className="hidden lg:block w-px bg-gray-200" />

        <div className="lg:w-[340px] p-5">
          <GuardrailsPanel
            decision={normalizedDecision}
            bot={bot}
          />
        </div>
      </div>

      {/* MARKET INTELLIGENCE */}

      <div className="rounded-xl border p-5">
        {loadingMarketIntelligence ? (
          <div className="text-sm text-gray-400">
            Loading market intelligence...
          </div>
        ) : (
          <MarketDecisionCard decision={normalizedDecision} />
        )}
      </div>

      {/* Decision + Plan */}

      <div className="flex flex-col lg:flex-row border rounded-xl overflow-hidden">
        <div className="flex-1 p-5">
          <BotDecisionCard
            bot={bot}
            decision={normalizedDecision}
            order={safeOrder}
            loading={loadingDecision}
            isAuto={isAuto}
            onGenerate={onGenerate}
            onExecute={!isAuto ? onExecute : undefined}
            onSkip={!isAuto ? onSkip : undefined}
          />
        </div>

        <div className="hidden lg:block w-px bg-gray-200" />

        <div className="flex-1 p-5 space-y-6">
          <TradePlanCard
            decision={normalizedDecision}
            tradePlan={planSource}
            loading={loadingDecision}
            allowManual={!isAuto}
            onSave={canSavePlan ? handleSaveTradePlan : undefined}
            saving={savingPlan}
            error={saveError}
          />
        </div>
      </div>

      {/* History */}

      <div className="pt-2 border-t">
        <button
          onClick={() => setShowHistory((v) => !v)}
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2"
        >
          <Clock size={14} />
          {showHistory ? "Verberg history" : "Toon history"}
        </button>

        {showHistory && (
          <div className="pt-4">
            <BotHistoryTable history={combinedHistory} />
          </div>
        )}
      </div>
    </div>
  );
}
