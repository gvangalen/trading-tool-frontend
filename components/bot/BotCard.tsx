"use client";

import {
  Bot,
  Pencil,
  Trash2,
  Play,
  Pause,
} from "lucide-react";

export default function BotCard({
  bot,
  isActive = false,
  onSelect,
  onEdit,
  onDelete,
  onRun,
}) {
  if (!bot) return null;

  const rules = Array.isArray(bot.rules) ? bot.rules : [];

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
          <Bot className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <h3 className="font-semibold leading-tight">
              {bot.name}
            </h3>
            <p className="text-xs text-muted">
              {String(bot.bot_type).toUpperCase()} • {bot.symbol} • {bot.mode}
            </p>
          </div>
        </div>

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

      {/* ================= RULES ================= */}
      <div className="space-y-2">
        <div className="text-xs font-medium uppercase text-muted">
          Rules
        </div>

        {rules.length === 0 && (
          <p className="text-sm text-muted">
            Geen rules geconfigureerd.
          </p>
        )}

        {rules.map((rule, i) => (
          <div
            key={rule.id ?? i}
            className="flex justify-between text-sm border-b pb-1 last:border-0"
          >
            <span className={rule.enabled === false ? "line-through opacity-60" : ""}>
              {rule.condition || "—"}
            </span>
            <span className="font-medium">
              {rule.action || ""}
            </span>
          </div>
        ))}
      </div>

      {/* ================= ACTION ================= */}
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
        >
          {bot.is_active ? (
            <>
              <Play size={14} />
              Run
            </>
          ) : (
            <>
              <Pause size={14} />
              Inactief
            </>
          )}
        </button>
      </div>
    </div>
  );
}
