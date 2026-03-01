"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import BotSettingsMenu from "@/components/bot/BotSettingsMenu";

import TradePlanCard from "@/components/bot/TradePlanCard";
import TradePanelContainer from "@/components/bot/TradePanelContainer";

import MarketDecisionCard from "@/components/bot/MarketDecisionCard";
import MarketConditionsInline from "@/components/bot/MarketConditionsPanel";
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

  onGenerate,
  onExecute,
  onSkip,
  onOpenSettings,

  onSaveTradePlan,
  onPlaceManualOrder,
}) {
  if (!bot) return null;

  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  const [savingPlan, setSavingPlan] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const isAuto = bot?.mode === "auto";

  /* ================= DATA ================= */

  const symbol = (bot?.strategy?.symbol || bot?.symbol || "BTC").toUpperCase();
  const timeframe = bot?.strategy?.timeframe || bot?.timeframe || "—";

  const statusLabel = (decision?.action || "OBSERVE").toUpperCase();
  const confidence =
    decision?.confidence_label || decision?.confidence || "LOW";

  const exposureMultiplier =
    decision?.exposure_multiplier ??
    bot?.strategy?.exposure_multiplier ??
    1;

  /* ================= MERGE TRADES + HISTORY ================= */

  const combinedHistory = useMemo(() => {
    const botHistory = (history || []).filter(
      (h) => h.bot_id === bot.id
    );

    const tradeAsHistory = (trades || []).map((t) => ({
      id: t.id,
      bot_id: bot.id,
      created_at: t.executed_at,
      side: t.side,
      qty: t.qty,
      price: t.price,
      amount_eur: t.amount_eur,
      confidence: t.confidence || null,
      status: "executed",
      symbol: t.symbol,
      mode: t.mode,
    }));

    return [...tradeAsHistory, ...botHistory].sort((a, b) => {
      const d1 = new Date(a.created_at || a.date || 0);
      const d2 = new Date(b.created_at || b.date || 0);
      return d2 - d1;
    });
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
    riskConfig[
      String(bot?.risk_profile || "balanced").toLowerCase()
    ] || riskConfig.balanced;

  /* ================= SAVE TRADE PLAN ================= */

  const decisionId = decision?.id ?? decision?.decision_id ?? null;
  const botId = decision?.bot_id ?? bot?.id ?? null;

  const canSavePlan =
    !isAuto && !!onSaveTradePlan && !!decisionId && !!botId;

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
      setSaveError(e?.message || "Opslaan mislukt");
      throw e;
    } finally {
      setSavingPlan(false);
    }
  };

  /* ================= MANUAL TRADE ================= */

  const handleManualTrade = async (payload) => {
    if (!onPlaceManualOrder) return;

    await onPlaceManualOrder({
      bot_id: bot.id,
      ...payload,
    });
  };

  /* ================= PLAN SOURCE ================= */

  const planSource = useMemo(() => {
    return decision?.trade_plan || null;
  }, [decision]);

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
            <div className="text-2xl font-bold">{bot?.name}</div>
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

        <div className="text-sm text-gray-500">
          {symbol} · {timeframe}
        </div>

        <div className="flex gap-3">
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

        <div className="bg-gray-50 border rounded-lg px-4 py-3 flex items-center gap-3 text-sm">
          <Activity size={16} className="text-gray-500" />
          <span className="font-medium text-gray-600">Status:</span>
          <span className="font-bold">{statusLabel}</span>
          <span className="text-gray-400">•</span>
          <span>
            Confidence <strong>{confidence}</strong>
          </span>
        </div>
      </div>

      {/* Portfolio + Guardrails */}
      <div className="flex flex-col lg:flex-row border rounded-xl overflow-hidden">
        <div className="flex-1 p-5">
          <BotPortfolioCard bot={portfolio} />
        </div>

        <div className="hidden lg:block w-px bg-gray-200" />

        <div className="lg:w-[340px] p-5 bg-gray-50">
          <GuardrailsPanel decision={decision} bot={bot} />
        </div>
      </div>

      {/* Market Intelligence */}
      <div className="rounded-xl border p-5">
        <MarketDecisionCard decision={decision} />

        <div className="mt-4 pt-4 border-t">
          <MarketConditionsInline
            health={decision?.market_health}
            transitionRisk={decision?.transition_risk}
            pressure={decision?.market_pressure}
            multiplier={exposureMultiplier}
          />
        </div>
      </div>

      {/* Decision + Plan + Manual Trade */}
      <div className="flex flex-col lg:flex-row border rounded-xl overflow-hidden">
        <div className="flex-1 p-5">
          <BotDecisionCard
            bot={bot}
            decision={decision}
            order={order}
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
            decision={decision}
            tradePlan={planSource}
            loading={loadingDecision}
            allowManual={!isAuto}
            onSave={canSavePlan ? handleSaveTradePlan : undefined}
          />

          {!isAuto && (
            <TradePanelContainer
              bot={bot}
              decision={decision}
              portfolio={portfolio}
              onManualTrade={handleManualTrade}
            />
          )}
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
