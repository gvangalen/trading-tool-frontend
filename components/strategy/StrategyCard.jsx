"use client";

import { useState } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  analyzeStrategy,
  deleteStrategy,
  updateStrategy,
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
  Trash2,
} from "lucide-react";

export default function StrategyCard({
  strategy,
  onRefresh,
  onDelete,
  onUpdate,
}) {
  if (!strategy) return null;

  const { showSnackbar, confirm } = useModal();

  const [loading, setLoading] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  const {
    id,
    setup_name,
    symbol,
    timeframe,
    strategy_type,
    entry,
    targets = [],
    stop_loss,
    favorite,
    ai_explanation,
  } = strategy;

  const isDCA = strategy_type === "dca";
  const display = (v) => (v ? v : "-");

  /* =====================================================
   * 🧠 AI ANALYSE (ASYNC → REFRESH)
   * ===================================================== */
  const handleAnalyze = async () => {
    try {
      setLoading(true);

      await analyzeStrategy(id);

      showSnackbar("🧠 AI-uitleg bijgewerkt", "success");

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);

      onRefresh?.();
    } catch (err) {
      console.error("❌ AI analyse fout:", err);
      showSnackbar("AI analyse mislukt", "danger");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
   * ⭐ FAVORITE TOGGLE
   * ===================================================== */
  const toggleFavorite = async () => {
    try {
      await updateStrategy(id, { favorite: !favorite });
      onUpdate?.();
      onRefresh?.();
    } catch (err) {
      console.error("❌ Favorite toggle fout:", err);
      showSnackbar("Kon favoriet niet aanpassen", "danger");
    }
  };

  /* =====================================================
   * 🗑 DELETE STRATEGY
   * ===================================================== */
  const handleDelete = async () => {
    const ok = await confirm(
      "Strategie verwijderen?",
      "Deze actie kan niet ongedaan worden gemaakt."
    );

    if (!ok) return;

    try {
      await deleteStrategy(id);
      showSnackbar("Strategie verwijderd", "success");
      onDelete?.();
      onRefresh?.();
    } catch (err) {
      console.error("❌ Strategie verwijderen mislukt:", err);
      showSnackbar("Verwijderen mislukt", "danger");
    }
  };

  /* =====================================================
   * 🧱 RENDER
   * ===================================================== */
  return (
    <div
      className={`
        border rounded-xl p-6 bg-white dark:bg-gray-900 shadow-lg relative
        ${justUpdated ? "ring-2 ring-purple-500 ring-offset-2" : ""}
      `}
    >
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <AILoader text="AI analyse bezig…" />
        </div>
      )}

      <h3 className="font-bold text-xl mb-2">{setup_name}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {strategy_type} | {symbol} {timeframe}
      </p>

      {!isDCA && (
        <div className="space-y-1 text-sm mb-4">
          <div>
            <ArrowRightLeft className="inline w-4 h-4" /> Entry: {display(entry)}
          </div>
          <div>
            <Target className="inline w-4 h-4" /> Targets: {targets.join(", ")}
          </div>
          <div>
            <ShieldAlert className="inline w-4 h-4" /> SL: {display(stop_loss)}
          </div>
        </div>
      )}

      {/* 🧠 AI-UITLEG */}
      {ai_explanation && (
        <div className="mt-4 p-4 rounded-lg bg-purple-50 text-purple-700 text-sm">
          <Bot className="inline w-4 h-4 mr-1" />
          <strong>AI-uitleg</strong>
          <p className="mt-2">{ai_explanation}</p>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-4">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm"
          >
            <Wand2 className="w-4 h-4" />
            Analyseer (AI)
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Verwijder
          </button>
        </div>

        <button onClick={toggleFavorite}>
          {favorite ? <Star /> : <StarOff className="text-gray-400" />}
        </button>
      </div>
    </div>
  );
}
