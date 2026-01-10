"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { SlidersHorizontal, Pencil } from "lucide-react";

/**
 * BotRules
 * --------------------------------------------------
 * - Toont rules van de ACTIEVE bot
 * - Maakt bot-context expliciet (UX!)
 * - Stateless
 * - Edit wordt afgehandeld door parent (BotPage)
 */
export default function BotRules({
  bot,            // 👈 ACTIEVE BOT (verplicht voor context)
  rules = [],
  loading = false,
  onEdit,
}) {
  const hasBot = !!bot;
  const hasRules = Array.isArray(rules) && rules.length > 0;

  return (
    <CardWrapper
      title={
        hasBot
          ? `Bot Rules — ${bot.name}`
          : "Bot Rules"
      }
      subtitle={
        hasBot
          ? `${bot.bot_type.toUpperCase()} bot • ${bot.symbol}`
          : "Geen bot geselecteerd"
      }
      icon={<SlidersHorizontal className="icon" />}
      action={
        hasBot && onEdit ? (
          <button
            className="btn-icon"
            onClick={onEdit}
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
      {/* NO BOT SELECTED */}
      {/* ===================== */}
      {!loading && !hasBot && (
        <p className="text-sm text-[var(--text-muted)]">
          Selecteer eerst een bot om regels te bekijken of te bewerken.
        </p>
      )}

      {/* ===================== */}
      {/* EMPTY STATE (BOT, MAAR GEEN RULES) */}
      {/* ===================== */}
      {!loading && hasBot && !hasRules && (
        <p className="text-sm text-[var(--text-muted)]">
          Geen regels geconfigureerd voor{" "}
          <b>{bot.name}</b>.
        </p>
      )}

      {/* ===================== */}
      {/* RULES LIST */}
      {/* ===================== */}
      {!loading && hasBot && hasRules && (
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
