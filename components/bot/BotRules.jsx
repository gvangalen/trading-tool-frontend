"use client";

import { useEffect, useState } from "react";
import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { SlidersHorizontal, Plus, Trash2 } from "lucide-react";

/**
 * BotRules
 * --------------------------------------------------
 * - Bot selecteren (dropdown IN de card)
 * - Rules aanmaken / bewerken / verwijderen
 * - Frontend state ONLY
 * - Geen modals, geen verborgen context
 *
 * Props:
 * - bots: [{ id, name, bot_type, symbol }]
 * - loading: boolean
 * - rulesByBotId: { [botId]: rules[] }
 * - onChangeRules(botId, rules)
 */
export default function BotRules({
  bots = [],
  loading = false,
  rulesByBotId = {},
  onChangeRules,
}) {
  /* =====================================================
     🧠 SELECTED BOT
  ===================================================== */
  const [selectedBotId, setSelectedBotId] = useState(null);

  useEffect(() => {
    if (!bots.length) {
      setSelectedBotId(null);
      return;
    }

    if (!selectedBotId || !bots.find((b) => b.id === selectedBotId)) {
      setSelectedBotId(bots[0].id);
    }
  }, [bots, selectedBotId]);

  const selectedBot = bots.find((b) => b.id === selectedBotId) ?? null;
  const rules = rulesByBotId[selectedBotId] || [];

  /* =====================================================
     🧠 RULE HELPERS
  ===================================================== */
  const updateRules = (nextRules) => {
    if (!selectedBotId) return;
    onChangeRules(selectedBotId, nextRules);
  };

  const addRule = () => {
    updateRules([
      ...rules,
      {
        id: crypto.randomUUID(),
        name: "Nieuwe rule",
        condition: "",
        action: "BUY",
      },
    ]);
  };

  const updateRule = (id, field, value) => {
    updateRules(
      rules.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  };

  const removeRule = (id) => {
    updateRules(rules.filter((r) => r.id !== id));
  };

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
          : "Selecteer een bot"
      }
      icon={<SlidersHorizontal className="icon" />}
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
          Nog geen bots aangemaakt.
        </p>
      )}

      {/* ===================== */}
      {/* BOT SELECT */}
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
                {bot.name} — {bot.bot_type?.toUpperCase()} • {bot.symbol}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ===================== */}
      {/* RULES */}
      {/* ===================== */}
      {selectedBot && (
        <>
          {rules.length === 0 && (
            <p className="text-sm text-[var(--text-muted)] mb-2">
              Geen regels voor deze bot.
            </p>
          )}

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="border border-[var(--border)] rounded-lg p-3 space-y-2"
              >
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    value={rule.name}
                    onChange={(e) =>
                      updateRule(rule.id, "name", e.target.value)
                    }
                    placeholder="Rule naam"
                  />
                  <button
                    className="btn-icon text-red-500"
                    onClick={() => removeRule(rule.id)}
                    title="Verwijderen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <input
                  className="input"
                  value={rule.condition}
                  onChange={(e) =>
                    updateRule(rule.id, "condition", e.target.value)
                  }
                  placeholder="Voorwaarde (bv: score > 70)"
                />

                <select
                  className="input"
                  value={rule.action}
                  onChange={(e) =>
                    updateRule(rule.id, "action", e.target.value)
                  }
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                  <option value="HOLD">HOLD</option>
                </select>
              </div>
            ))}
          </div>

          <button
            className="btn-secondary w-full mt-4"
            onClick={addRule}
          >
            <Plus size={16} className="mr-1" />
            Rule toevoegen
          </button>
        </>
      )}
    </CardWrapper>
  );
}
