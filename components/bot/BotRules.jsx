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
 * - Edit knop opent editor voor die bot
 * - Stateless naar buiten toe
 *
 * Verwachte props:
 * - bots: array van bot-configs [{ id, name, bot_type, symbol, rules }]
 * - loading: boolean
 * - onEdit(bot): callback → opent BotRulesEditor
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
     🧠 Init default bot (1x)
  ===================================================== */
  useEffect(() => {
    if (!selectedBotId && bots.length > 0) {
      setSelectedBotId(bots[0].id);
    }
  }, [bots, selectedBotId]);

  const selectedBot =
    bots.find((b) => b.id === selectedBotId) ?? null;

  const rules = selectedBot?.rules ?? [];
  const hasRules = Array.isArray(rules) && rules.length > 0;

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
          ? `${selectedBot.bot_type.toUpperCase()} bot • ${selectedBot.symbol}`
          : "Selecteer een bot om regels te beheren"
      }
      icon={<SlidersHorizontal className="icon" />}
      action={
        selectedBot && onEdit ? (
          <button
            className="btn-icon"
            onClick={() => onEdit(selectedBot)}
            title="Regels bewerken"
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
      {/* BOT SELECTOR */}
      {/* ===================== */}
      {!loading && bots.length > 0 && (
        <div className="mb-4">
          <label className="text-xs text-[var(--text-muted)] block mb-1">
            Selecteer bot
          </label>
          <select
            className="input w-full"
            value={selectedBotId ?? ""}
            onChange={(e) => setSelectedBotId(e.target.value)}
          >
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name} ({bot.bot_type.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ===================== */}
      {/* NO BOT */}
      {/* ===================== */}
      {!loading && bots.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">
          Nog geen bots aangemaakt.
        </p>
      )}

      {/* ===================== */}
      {/* EMPTY RULES */}
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
            const ruleText =
              typeof rule === "string"
                ? rule
                : rule.name ||
                  rule.rule ||
                  rule.condition ||
                  "—";

            const actionText =
              typeof rule === "string"
                ? ""
                : rule.action || rule.result || "";

            const enabled =
              typeof rule === "object"
                ? rule.enabled !== false
                : true;

            return (
              <div
                key={rule.id ?? index}
                className="
                  flex justify-between items-center
                  border-b border-[var(--border)]
                  pb-2 last:border-0
                "
              >
                <span
                  className={
                    enabled
                      ? ""
                      : "line-through text-[var(--text-muted)]"
                  }
                >
                  {ruleText}
                </span>

                {actionText && (
                  <span className="font-medium">
                    {actionText}
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
