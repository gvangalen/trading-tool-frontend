"use client";

import {
  Settings,
  Wallet,
  Zap,
  PauseCircle,
  PlayCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";

/**
 * BotSettingsMenu — TradeLayer 2.5
 * --------------------------------------------------
 * Centrale settings entry per bot
 *
 * Verantwoordelijkheden:
 * - Openen van bestaande modals (single source of truth)
 * - Pauzeren / hervatten
 * - Veilig verwijderen
 *
 * Props:
 * - bot (verplicht)
 * - onOpen(type, bot)
 *
 * Types:
 * - "general"
 * - "portfolio"
 * - "automation"
 * - "pause"
 * - "resume"
 * - "delete"
 */
export default function BotSettingsMenu({ bot, onOpen }) {
  if (!bot) return null;

  const isPaused = bot.status === "paused";
  const isAuto = bot.mode === "auto";

  return (
    <div className="w-64 rounded-xl border bg-white shadow-md p-2 text-sm">
      {/* ================= HEADER ================= */}
      <div className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)]">
        Bot instellingen
      </div>

      {/* ================= ALGEMEEN ================= */}
      <button
        onClick={() => onOpen("general", bot)}
        className="settings-item"
      >
        <Settings size={16} />
        <span>Algemeen</span>
      </button>

      {/* ================= PORTFOLIO ================= */}
      <button
        onClick={() => onOpen("portfolio", bot)}
        className="settings-item"
      >
        <Wallet size={16} />
        <span>Portfolio & budget</span>
      </button>

      {/* ================= AUTOMATION ================= */}
      <button
        onClick={() => onOpen("automation", bot)}
        className="settings-item"
      >
        <Zap size={16} />
        <span>Automatisering</span>
      </button>

      {/* ================= DIVIDER ================= */}
      <div className="my-2 border-t" />

      {/* ================= PAUSE / RESUME ================= */}
      {isPaused ? (
        <button
          onClick={() => onOpen("resume", bot)}
          className="settings-item text-green-600"
        >
          <PlayCircle size={16} />
          <span>Bot hervatten</span>
        </button>
      ) : (
        <button
          onClick={() => onOpen("pause", bot)}
          className="settings-item text-orange-600"
        >
          <PauseCircle size={16} />
          <span>Bot pauzeren</span>
        </button>
      )}

      {/* ================= DELETE ================= */}
      <button
        onClick={() => onOpen("delete", bot)}
        className="settings-item text-red-600"
      >
        <Trash2 size={16} />
        <span>Bot verwijderen</span>
      </button>

      {/* ================= SAFETY NOTE ================= */}
      {isAuto && (
        <div className="mt-2 px-3 py-2 text-xs rounded-md bg-red-50 text-red-700 flex gap-2">
          <AlertTriangle size={14} className="mt-0.5" />
          <span>
            Auto-bot kan niet worden verwijderd terwijl hij actief is.
          </span>
        </div>
      )}
    </div>
  );
}
