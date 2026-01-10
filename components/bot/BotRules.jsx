"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { SlidersHorizontal, Pencil } from "lucide-react";

/**
 * BotRules
 * --------------------------------------------------
 * - Toont rules van de geselecteerde / actieve bot
 * - Volledig stateless
 * - Geen backend logica
 * - Edit wordt afgehandeld door parent (BotPage)
 */
export default function BotRules({
  rules = [],
  loading = false,
  onEdit,
}) {
  const hasRules = Array.isArray(rules) && rules.length > 0;

  return (
    <CardWrapper
      title="Bot Rules"
      icon={<SlidersHorizontal className="icon" />}
      action={
        onEdit && (
          <button
            className="btn-icon"
            onClick={onEdit}
            title="Regels bewerken"
          >
            <Pencil size={16} />
          </button>
        )
      }
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && <CardLoader text="Rules laden…" />}

      {/* ===================== */}
      {/* EMPTY STATE */}
      {/* ===================== */}
      {!loading && !hasRules && (
        <p className="text-sm text-[var(--text-muted)]">
          Geen regels geconfigureerd voor deze bot.
        </p>
      )}

      {/* ===================== */}
      {/* RULES LIST */}
      {/* ===================== */}
      {!loading && hasRules && (
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
