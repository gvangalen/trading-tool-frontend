"use client";

import { useState } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  analyzeStrategy,
  deleteStrategy,
  toggleFavoriteStrategy,
} from "@/lib/api/strategy";

import AILoader from "@/components/ui/AILoader";

import {
  ArrowRightLeft,
  Target,
  ShieldAlert,
  Bot,
  Wand2,
  Star,
  StarOff,
  Trash,
  Pencil,
  Clock,
  Euro,
  Tags,
  Activity,
} from "lucide-react";

export default function StrategyCard({ strategy, onRefresh }) {
  if (!strategy) return null;

  const { openConfirm, showSnackbar } = useModal();

  const [loading, setLoading] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  /* ==========================================================
     DATA (DEFENSIEF – BACKWARD COMPATIBLE)
  ========================================================== */
  const {
    id,
    symbol,
    timeframe,
    strategy_type,
    entry,
    stop_loss,
    amount,
    frequency,
    risk_profile,
    explanation,
    ai_explanation,
    favorite,
  } = strategy;

  const setupName =
    strategy.setup_name ||
    strategy.setupName ||
    strategy.setup?.name ||
    "Strategie";

  const targets = Array.isArray(strategy.targets)
    ? strategy.targets
    : strategy.target
    ? [strategy.target]
    : [];

  const tags = Array.isArray(strategy.tags)
    ? strategy.tags
    : typeof strategy.tags === "string"
    ? strategy.tags.split(",").map((t) => t.trim())
    : [];

  const isDCA = strategy_type === "dca";
  const display = (v) => (v !== undefined && v !== null && v !== "" ? v : "-");

  /* ==========================================================
     🧠 AI ANALYSE
  ========================================================== */
  async function handleAnalyze() {
    try {
      setLoading(true);
      await analyzeStrategy(id);
      showSnackbar("AI-uitleg bijgewerkt", "success");
      flashUpdate();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      showSnackbar("AI analyse mislukt", "danger");
    } finally {
      setLoading(false);
    }
  }

  /* ==========================================================
     ⭐ FAVORIET TOGGLE (CORRECTE ENDPOINT)
  ========================================================== */
  async function toggleFavorite() {
    try {
      await toggleFavoriteStrategy(id);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      showSnackbar("Favoriet aanpassen mislukt", "danger");
    }
  }

  /* ==========================================================
     ✏️ EDIT STRATEGY
  ========================================================== */
  function openEditModal() {
    openConfirm({
      title: `Strategie bewerken – ${setupName}`,
      icon: <Pencil />,
      tone: "primary",
      confirmText: "Opslaan",
      cancelText: "Annuleren",
      description: <StrategyFormWrapper strategy={strategy} />,
      onConfirm: () => {
        document.querySelector("#strategy-edit-submit")?.click();
      },
    });
  }

  function StrategyFormWrapper({ strategy }) {
    const StrategyForm =
      require("@/components/strategy/StrategyForm").default;

    return (
      <div className="space-y-6 pt-4">
        <StrategyForm
          mode="edit"
          initialData={strategy}
          onSaved={() => {
            onRefresh?.();
            showSnackbar("Strategie bijgewerkt!", "success");
          }}
        />
      </div>
    );
  }

  /* ==========================================================
     🗑 DELETE STRATEGY
  ========================================================== */
  function openDeleteModal() {
    openConfirm({
      title: "Strategie verwijderen",
      description: (
        <p className="leading-relaxed">
          Weet je zeker dat je deze strategie wilt verwijderen?
          <br />
          <span className="text-red-600 font-medium">
            Dit kan niet ongedaan worden gemaakt.
          </span>
        </p>
      ),
      icon: <Trash />,
      tone: "danger",
      confirmText: "Verwijderen",
      cancelText: "Annuleren",
      onConfirm: async () => {
        try {
          await deleteStrategy(id);
          showSnackbar("Strategie verwijderd", "success");
          onRefresh?.();
        } catch (err) {
          console.error(err);
          showSnackbar("Verwijderen mislukt", "danger");
        }
      },
    });
  }

  function flashUpdate() {
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 2000);
  }

  /* ==========================================================
     UI
  ========================================================== */
  return (
    <div
      className={`
        relative border rounded-xl p-6
        bg-white dark:bg-gray-900 shadow-lg
        ${justUpdated ? "ring-2 ring-purple-500 ring-offset-2" : ""}
      `}
    >
      {/* AI overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <AILoader text="AI analyse bezig…" />
        </div>
      )}

      {/* Favoriet */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500"
      >
        {favorite ? (
          <Star size={20} className="text-yellow-500" />
        ) : (
          <StarOff size={20} />
        )}
      </button>

      {/* Header */}
      <h3 className="font-bold text-xl mb-1">{setupName}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {strategy_type} | {symbol} {timeframe}
      </p>

      {/* ================= DCA INFO ================= */}
      {isDCA && (
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Euro size={14} /> Bedrag: €{display(amount)}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} /> Frequentie: {display(frequency)}
          </div>
          <div className="flex items-center gap-2">
            <Activity size={14} /> Risico: {display(risk_profile)}
          </div>
          <div className="flex items-center gap-2">
            <Tags size={14} /> Tags: {tags.length ? tags.join(", ") : "-"}
          </div>
        </div>
      )}

      {/* ================= TRADING INFO ================= */}
      {!isDCA && (
        <div className="space-y-1 text-sm mb-4">
          <div>
            <ArrowRightLeft className="inline w-4 h-4" /> Entry:{" "}
            {display(entry)}
          </div>
          <div>
            <Target className="inline w-4 h-4" /> Targets:{" "}
            {targets.length ? targets.join(", ") : "-"}
          </div>
          <div>
            <ShieldAlert className="inline w-4 h-4" /> SL:{" "}
            {display(stop_loss)}
          </div>
        </div>
      )}

      {/* Handmatige uitleg */}
      {explanation && (
        <div className="text-sm text-gray-600 mb-3">
          <strong>Uitleg:</strong> {explanation}
        </div>
      )}

      {/* AI uitleg */}
      {ai_explanation && (
        <div className="mt-4 p-4 rounded-lg bg-purple-50 text-purple-700 text-sm">
          <Bot className="inline w-4 h-4 mr-1" />
          <strong>AI-uitleg</strong>
          <p className="mt-2 whitespace-pre-line">{ai_explanation}</p>
        </div>
      )}

      {/* Acties */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-4">
          <button
            onClick={handleAnalyze}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm"
          >
            <Wand2 size={16} />
            Analyseer (AI)
          </button>

          <button
            onClick={openEditModal}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <Pencil size={16} />
            Bewerken
          </button>
        </div>

        <button
          onClick={openDeleteModal}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm"
        >
          <Trash size={16} />
          Verwijder
        </button>
      </div>
    </div>
  );
}
