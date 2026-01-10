"use client";

import { useEffect, useState } from "react";
import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { SlidersHorizontal, Pencil } from "lucide-react";

/**
 * BotRules
 * --------------------------------------------------
 * - Bevat ZELF bot-selectie (dropdown)
 * - Toont rules van geselecteerde bot
 * - Edit knop opent editor voor DIE bot
 * - Geen verborgen context
 * - UX = expliciet, voorspelbaar, logisch
 *
 * Props:
 * - bots: [{ id, name, bot_type, symbol, rules }]
 * - loading: boolean
 * - onEdit(bot): opent BotRulesEditor
 */
export default function BotRules({
  bots = [],
  loading = false,
  onEdit,
}) {
  /* =====================================================
     🧠 LOCAL STATE — geselecteerde bot
  ===================================================== */
  const [selectedBotId, setSelectedBotId] = useState(null);

  /* =====================================================
     ✅ INIT / SYNC SELECTED BOT
     - bij eerste load
     - bij verwijderen van bots
  ===================================================== */
  useEffect(() => {
    if (!bots || bots.length === 0) {
      setSelectedBotId(null);
      return;
    }

    // als huidige selectie niet meer bestaat → reset
    const exists = bots.some((b) => b.id === selectedBotId);

    if (!selectedBotId || !exists) {
      setSelectedBotId(bots[0].id);
    }
  }, [bots, selectedBotId]);

  /* =====================================================
     🧠 AFGELEIDE DATA
  ===================================================== */
  const selectedBot =
    bots.find((b) => b.id === selectedBotId) ?? null;

  const rules =
    Array.isArray(selectedBot?.rules) ? selectedBot.rules : [];

  const hasRules = rules.length > 0;

  /* =====================================================
     🧠 RENDER
  ===================================================== */
  return (
    <CardWrapper
      title={
        selectedBot
          ? `Bot Rules — ${selectedBot.name}`
          : "Bot Rules"
      }
      subtitle={
        selectedBot
          ? `${String(selectedBot.bot_type).toUpperCase()} • ${selectedBot.symbol}`
          : "Selecteer een bot om regels te beheren"
      }
      icon={<SlidersHorizontal className="icon" />}
      action={
        selectedBot && onEdit ? (
          <button
            className="btn-icon"
            onClick={() => onEdit(selectedBot)}
            title="Rules bewerken"
          >
            <Pencil size={16} />
          </button>
        ) : null
      }
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && <CardLoader text="Rules laden…" />}

      {/* ===================== */}
      {/* GEEN BOTS */}
      {/* ===================== */}
      {!loading && bots.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">
          Nog geen bots aangemaakt. Maak eerst een bot aan.
        </p>
      )}

      {/* ===================== */}
      {/* BOT SELECTOR */}
      {/* ===================== */}
      {!loading && bots.length > 0 && (
        <div className="mb-4">
          <label className="text-xs text-[var(--text-muted)] block mb-1">
            Bot selecteren
          </label>
          <select
            className="input w-full"
            value={selectedBotId ?? ""}
            onChange={(e) => setSelectedBotId(e.target.value)}
          >
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name} — {String(bot.bot_type).toUpperCase()} • {bot.symbol}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ===================== */}
      {/* GEEN RULES */}
      {/* ===================== */}
      {!loading && selectedBot && !hasRules && (
        <p className="text-sm text-[var(--text-muted)]">
          Geen regels geconfigureerd voor{" "}
          <b>{selectedBot.name}</b>.
        </p>
      )}

      {/* ===================== */}
      {/* RULES LIST */}
      {/* ===================== */}
      {!loading && selectedBot && hasRules && (
        <div className="space-y-3 text-sm">
          {rules.map((rule, index) => {
            const text =
              typeof rule === "string"
                ? rule
                : rule.name ||
                  rule.condition ||
                  rule.rule ||
                  "—";

            const action =
              typeof rule === "object"
                ? rule.action || rule.result || ""
                : "";

            const enabled =
              typeof rule === "object"
                ? rule.enabled !== false
                : true;

            return (
              <div
                key={rule.id ?? index}
                className="flex justify-between items-center border-b border-[var(--border)] pb-2 last:border-0"
              >
                <span
                  className={
                    enabled
                      ? ""
                      : "line-through text-[var(--text-muted)]"
                  }
                >
                  {text}
                </span>

                {action && (
                  <span className="font-medium">
                    {action}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </CardWrapper>
  );
}
