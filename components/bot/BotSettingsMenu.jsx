"use client";

import {
  Settings,
  Sliders,
  Wallet,
  Zap,
} from "lucide-react";

/**
 * BotSettingsMenu
 *
 * Doel:
 * - Centrale ingang voor alle bot-instellingen
 * - Opent bestaande modals (single source of truth)
 *
 * Verwacht:
 * onOpen(type: "general" | "strategy" | "portfolio" | "automation")
 */
export default function BotSettingsMenu({ onOpen }) {
  return (
    <div className="w-64 rounded-xl border bg-white shadow-md p-2 text-sm">
      <div className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)]">
        Bot instellingen
      </div>

      <button
        onClick={() => onOpen("general")}
        className="settings-item"
      >
        <Settings size={16} />
        <span>Algemeen</span>
      </button>

      <button
        onClick={() => onOpen("strategy")}
        className="settings-item"
      >
        <Sliders size={16} />
        <span>Strategie</span>
      </button>

      <button
        onClick={() => onOpen("portfolio")}
        className="settings-item"
      >
        <Wallet size={16} />
        <span>Portfolio & budget</span>
      </button>

      <button
        onClick={() => onOpen("automation")}
        className="settings-item"
      >
        <Zap size={16} />
        <span>Automatisering</span>
      </button>
    </div>
  );
}
