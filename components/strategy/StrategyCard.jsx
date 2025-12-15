"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  updateStrategy,
  deleteStrategy,
  generateStrategy,   // ➜ start AI analyse
  fetchTaskStatus,
} from "@/lib/api/strategy";

import StrategyFormTrading from "@/components/strategy/StrategyFormTrading";
import StrategyFormDCA from "@/components/strategy/StrategyFormDCA";
import StrategyFormManual from "@/components/strategy/StrategyFormManual";

import AILoader from "@/components/ui/AILoader";

import {
  Pencil,
  Trash2,
  ArrowRightLeft,
  Target,
  ShieldAlert,
  Bot,
  Wand2,
  Star,
  StarOff,
} from "lucide-react";

export default function StrategyCard({ strategy, onUpdated }) {
  if (!strategy) return null;

  const { openConfirm, showSnackbar } = useModal();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [justUpdated, setJustUpdated] = useState(false);

  const {
    id,
    setup_id,
    setup_name,
    symbol,
    timeframe,
    strategy_type,
    entry,
    targets = [],
    stop_loss,
    ai_explanation,
    favorite,
  } = strategy;

  const isDCA = strategy_type === "dca";
  const display = (v) => (v ? v : "-");

  /* =====================================================
     🧠 AI ANALYSE — GEEN STRATEGY INSERT
  ===================================================== */
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await generateStrategy(setup_id);

      if (!res?.task_id) {
        throw new Error("Geen task_id ontvangen");
      }

      const taskId = res.task_id;
      let tries = 0;

      while (tries < 40) {
        await new Promise((r) => setTimeout(r, 1500));
        const status = await fetchTaskStatus(taskId);

        if (!status) continue;
        if (status.state === "FAILURE") throw new Error("AI analyse mislukt");
        if (status.state === "SUCCESS") break;

        tries++;
      }

      showSnackbar("🧠 AI-advies bijgewerkt", "success");

      // optioneel: parent kan insights herladen
      onUpdated && onUpdated(id);

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2500);

    } catch (err) {
      console.error("❌ AI analyse fout:", err);
      setError("AI analyse mislukt.");
      showSnackbar("AI analyse mislukt", "danger");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     🎨 UI
  ===================================================== */
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
          <div><ArrowRightLeft className="inline w-4 h-4" /> Entry: {display(entry)}</div>
          <div><Target className="inline w-4 h-4" /> Targets: {targets.join(", ")}</div>
          <div><ShieldAlert className="inline w-4 h-4" /> SL: {display(stop_loss)}</div>
        </div>
      )}

      {ai_explanation && (
        <div className="mt-4 p-4 rounded-lg bg-purple-50 text-purple-700 text-sm">
          <Bot className="inline w-4 h-4 mr-1" />
          <strong>AI-advies:</strong>
          <div>{ai_explanation}</div>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm"
        >
          <Wand2 className="w-4 h-4" />
          Analyseer strategie (AI)
        </button>

        {favorite ? <Star /> : <StarOff className="text-gray-400" />}
      </div>
    </div>
  );
}
