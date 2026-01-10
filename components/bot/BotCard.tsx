"use client";

import {
  Bot as BotIcon,
  Pencil,
  Trash2,
  Play,
} from "lucide-react";

/**
 * BotCard (NEW MODEL)
 * --------------------------------------------------
 * Bot = uitvoerder
 * Strategy = intelligentie
 *
 * Verwachte bot shape:
 * {
 *   id
 *   name
 *   mode
 *   is_active
 *   strategy: {
 *     id
 *     name
 *     type
 *     symbol
 *     timeframe
 *   }
 * }
 */
export default function BotCard({
  bot,
  isActive = false,
  onSelect,
  onEdit,
  onDelete,
  onRun,
}) {
  if (!bot) return null;

  const strategy = bot.strategy;

  return (
    <div
      onClick={() => onSelect?.(bot)}
      className={`
        cursor-pointer rounded-xl border p-4 space-y-4
        transition
        ${
          isActive
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "border-[var(--card-border)] hover:border-[var(--accent)]"
        }
      `}
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <BotIcon className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <h3 className="font-semibold leading-tight">
              {bot.name}
            </h3>

            {strategy ? (
              <p className="text-xs text-muted">
                {String(strategy.type).toUpperCase()} •{" "}
                {strategy.symbol} •{" "}
                {strategy.timeframe}
              </p>
            ) : (
              <p className="text-xs text-red-500">
                ⚠️ Geen strategie gekoppeld
              </p>
            )}
          </div>
        </div>

        {/* ACTION ICONS */}
        <div className="flex gap-2">
          <button
            className="btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(bot);
            }}
            title="Bewerken"
          >
            <Pencil size={16} />
          </button>

          <button
            className="btn-icon text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(bot);
            }}
            title="Verwijderen"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ================= STRATEGY INFO ================= */}
      {strategy && (
        <div className="rounded-lg border bg-[var(--card-muted)] p-3 text-sm space-y-1">
          <div>
            <b>Strategie:</b> {strategy.name}
          </div>
          <div className="text-muted">
            Type: {String(strategy.type).toUpperCase()}
          </div>
        </div>
      )}

      {/* ================= STATUS + ACTION ================= */}
      <div className="flex justify-between items-center pt-2">
        <span
          className={`text-xs font-medium ${
            bot.is_active
              ? "text-green-600"
              : "text-muted"
          }`}
        >
          {bot.is_active ? "Actief" : "Inactief"}
        </span>

        <button
          className="btn-primary flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onRun?.(bot);
          }}
          disabled={!strategy}
        >
          <Play size={14} />
          Run
        </button>
      </div>
    </div>
  );
}
