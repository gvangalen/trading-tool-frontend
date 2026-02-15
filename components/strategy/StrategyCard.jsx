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
  Brain,
} from "lucide-react";

export default function StrategyCard({ strategy, onRefresh }) {
  if (!strategy) return null;

  const { openConfirm, showSnackbar } = useModal();

  const [loading, setLoading] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  /* ==========================================================
     DATA (DEFENSIEF & BACKWARD SAFE)
  ========================================================== */
  const {
    id,
    symbol,
    timeframe,
    strategy_type,
    entry,
    stop_loss,
    base_amount,
    frequency,
    risk_profile,
    explanation,
    ai_explanation,
    favorite,
    execution_mode,
    decision_curve,
  } = strategy;

  const curveName =
    strategy.curve_name ||
    decision_curve?.name ||
    strategy.data?.curve_name ||
    null;

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

  async function toggleFavorite() {
    try {
      await toggleFavoriteStrategy(id);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      showSnackbar("Favoriet aanpassen mislukt", "danger");
    }
  }

  function openDeleteModal() {
    openConfirm({
      title: "Strategie verwijderen",
      description:
        "Weet je zeker dat je deze strategie wilt verwijderen?",
      icon: <Trash />,
      tone: "danger",
      confirmText: "Verwijderen",
      onConfirm: async () => {
        await deleteStrategy(id);
        onRefresh?.();
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
        transition
        ${justUpdated ? "ring-2 ring-purple-500 ring-offset-2" : ""}
      `}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <AILoader text="AI analyse bezig…" />
        </div>
      )}

      {/* ⭐ Favorite */}
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
      <p className="text-sm text-gray-500 mb-2">
        {strategy_type} | {symbol} {timeframe}
      </p>

      {/* 🧠 Curve name */}
      {curveName && execution_mode === "custom" && (
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          <Brain size={14} />
          Curve: {curveName}
        </div>
      )}

      {/* ================= DCA INFO ================= */}
      {isDCA && (
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Euro size={14} /> €{display(base_amount)}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} /> {display(frequency)}
          </div>
          <div className="flex items-center gap-2">
            <Activity size={14} /> {display(risk_profile)}
          </div>
          <div className="flex items-center gap-2">
            <Tags size={14} /> {tags.length ? tags.join(", ") : "-"}
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

      {/* Explanation */}
      {explanation && (
        <div className="text-sm text-gray-600 mb-3">
          <strong>Uitleg:</strong> {explanation}
        </div>
      )}

      {/* AI Explanation */}
      {ai_explanation && (
        <div className="mt-4 p-4 rounded-lg bg-purple-50 text-purple-700 text-sm">
          <Bot className="inline w-4 h-4 mr-1" />
          <strong>AI-uitleg</strong>
          <p className="mt-2 whitespace-pre-line">{ai_explanation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleAnalyze}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm"
        >
          <Wand2 size={16} />
          Analyseer
        </button>

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
