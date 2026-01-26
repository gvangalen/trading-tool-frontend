"use client";

import { useEffect, useRef, useState } from "react";

import BotDecisionCard from "@/components/bot/BotDecisionCard";
import BotPortfolioCard from "@/components/bot/BotPortfolioCard";
import BotHistoryTable from "@/components/bot/BotHistoryTable";
import BotSettingsMenu from "@/components/bot/BotSettingsMenu";

import {
  Brain,
  MoreVertical,
  Clock,
  Shield,
  Scale,
  Rocket,
  Bot,
} from "lucide-react";

/**
 * BotAgentCard — TradeLayer 2.5 (FINAL / STABLE)
 * --------------------------------------------------
 * - Settings via 3-dot menu
 * - GEEN eigen modals
 * - GEEN budget logic
 * - Alles via BotPage (single source of truth)
 * - FIXED: menu is altijd klikbaar (z-index + overflow)
 */
export default function BotAgentCard({
  bot,
  decision,
  portfolio,
  history = [],
  loadingDecision = false,

  onGenerate,
  onExecute,
  onSkip,

  // 🔑 enige settings-ingang
  onOpenSettings, // (type, bot) => void
}) {
  if (!bot || !portfolio) return null;

  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const settingsRef = useRef(null);
  const isAuto = bot?.mode === "auto";

  /* =====================================================
     CLICK OUTSIDE — SETTINGS MENU
  ===================================================== */
  useEffect(() => {
    if (!showSettings) return;

    const handleClickOutside = (e) => {
      if (!settingsRef.current) return;
      if (settingsRef.current.contains(e.target)) return;
      setShowSettings(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showSettings]);

  /* =====================================================
     RISK PROFILE
  ===================================================== */
  const riskProfile = String(bot?.risk_profile ?? "balanced").toLowerCase();

  const riskConfig = {
    conservative: {
      label: "Conservative",
      icon: <Shield size={12} />,
      className: "bg-green-100 text-green-700 border-green-200",
    },
    balanced: {
      label: "Balanced",
      icon: <Scale size={12} />,
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    aggressive: {
      label: "Aggressive",
      icon: <Rocket size={12} />,
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const risk = riskConfig[riskProfile] ?? riskConfig.balanced;

  /* =====================================================
     STATE LABEL
  ===================================================== */
  const stateLabel = () => {
    if (!decision) return "GEEN VOORSTEL";
    if (decision.status === "executed") {
      return decision.executed_by === "auto"
        ? "AUTOMATISCH UITGEVOERD"
        : "UITGEVOERD";
    }
    if (decision.status === "skipped") return "OVERGESLAGEN";
    return String(decision.action || "—").toUpperCase();
  };

  return (
    <div className="w-full rounded-2xl border bg-white px-6 py-5 space-y-6 relative overflow-visible">
      {/* =====================================================
         HEADER
      ===================================================== */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="icon-primary">
            <Brain size={18} />
          </div>

          <div>
            <div className="font-semibold">{bot.name}</div>

            <div className="text-xs text-[var(--text-muted)]">
              {bot.symbol} · {bot.timeframe}
            </div>

            <div className="mt-2 text-xs">
              <span className="text-[var(--text-muted)]">Strategy:</span>{" "}
              <span className="font-medium">
                {bot.strategy?.name ?? "—"}
              </span>
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${risk.className}`}
              >
                {risk.icon}
                Risk: {risk.label}
              </span>

              {isAuto && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border bg-blue-50 text-blue-700">
                  <Bot size={12} />
                  Auto mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= SETTINGS MENU ================= */}
        <div className="relative z-[10000]" ref={settingsRef}>
          <button
            type="button"
            aria-label="Open bot instellingen"
            className="icon-muted hover:icon-primary relative z-[10001]"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings((v) => !v);
            }}
          >
            <MoreVertical size={18} />
          </button>

          {showSettings && (
            <div
              className="absolute right-0 mt-2 z-[10002]"
              onClick={(e) => e.stopPropagation()}
            >
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

      {/* =====================================================
         STATE BAR
      ===================================================== */}
      <div className="bg-[var(--bg-soft)] rounded-xl px-4 py-3 text-sm">
        <span className="text-[var(--text-muted)]">Huidige status:</span>{" "}
        <span className="font-semibold">{stateLabel()}</span>
        {decision?.confidence && (
          <>
            {" "}
            · Confidence{" "}
            <span className="font-semibold uppercase">
              {decision.confidence}
            </span>
          </>
        )}
      </div>

      {/* =====================================================
         MAIN GRID
      ===================================================== */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BotDecisionCard
          bot={bot}
          decision={decision}
          order={decision?.order ?? null}
          loading={loadingDecision}
          isAuto={isAuto}
          onGenerate={onGenerate}
          onExecute={
            !isAuto ? () => onExecute?.({ bot_id: bot.id }) : undefined
          }
          onSkip={
            !isAuto ? () => onSkip?.({ bot_id: bot.id }) : undefined
          }
        />

        {/* READ ONLY portfolio */}
        <BotPortfolioCard bot={portfolio} />
      </div>

      {/* =====================================================
         HISTORY
      ===================================================== */}
      <div className="pt-2 border-t">
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-2"
        >
          <Clock size={14} />
          {showHistory ? "Verberg history" : "Toon history"}
        </button>

        {showHistory && (
          <div className="pt-4">
            <BotHistoryTable
              history={history.filter((h) => h.bot_id === bot.id)}
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}
