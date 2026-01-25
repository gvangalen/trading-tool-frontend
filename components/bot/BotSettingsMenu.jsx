"use client";

import {
  Settings,
  Wallet,
  Zap,
  PauseCircle,
} from "lucide-react";

/**
 * BotSettingsMenu
 *
 * Doel:
 * - Centrale ingang voor alle bot-instellingen
 * - Geen strategy-wissels (strategy = vaste bot-identiteit)
 * - Veilige plek voor pauze & verwijderen
 *
 * Verwacht:
 * onOpen(type:
 *   | "general"
 *   | "portfolio"
 *   | "automation"
 *   | "status"
 * )
 */
export default function BotSettingsMenu({ onOpen }) {
  return (
    <div className="w-64 rounded-xl border bg-white shadow-md p-2 text-sm">
      <div className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)]">
        Bot instellingen
      </div>

      {/* Algemeen gedrag */}
      <button
        onClick={() => onOpen("general")}
        className="settings-item"
      >
        <Settings size={16} />
        <span>Algemeen</span>
      </button>

      {/* Budget & limieten */}
      <button
        onClick={() => onOpen("portfolio")}
        className="settings-item"
      >
        <Wallet size={16} />
        <span>Portfolio & budget</span>
      </button>

      {/* Automatisering */}
      <button
        onClick={() => onOpen("automation")}
        className="settings-item"
      >
        <Zap size={16} />
        <span>Automatisering</span>
      </button>

      {/* Divider */}
      <div className="my-2 border-t" />

      {/* Status & beheer */}
      <button
        onClick={() => onOpen("status")}
        className="settings-item text-[var(--text-muted)]"
      >
        <PauseCircle size={16} />
        <span>Status & beheer</span>
      </button>
    </div>
  );
}
