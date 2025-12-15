"use client";

import { useState } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  updateStrategy,
  deleteStrategy,
  analyzeStrategy,
  fetchTaskStatus,
  fetchStrategyAnalysis,   // ✅ BELANGRIJK
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
} from "lucide-react";

export default function StrategyCard({ strategy }) {
  if (!strategy) return null;

  const { showSnackbar } = useModal();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null); // ✅ NIEUW
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
  } = strategy;

  const isDCA = strategy_type === "dca";
  const display = (v) => (v ? v : "-");

  /* =====================================================
     🧠 AI ANALYSE (PERSISTENT)
  ===================================================== */
  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError("");

      // 1️⃣ Start analyse
      const res = await analyzeStrategy(id);
      if (!res?.task_id) throw new Error("Geen task_id");

      // 2️⃣ Poll task
      let tries = 0;
      while (tries < 30) {
        await new Promise((r) => setTimeout(r, 1500));
        const status = await fetchTaskStatus(res.task_id);

        if (status?.state === "FAILURE") throw new Error("AI analyse mislukt");
        if (status?.state === "SUCCESS") break;
        tries++;
      }

      // 3️⃣ Haal analyse OP uit DB
      const reflection = await fetchStrategyAnalysis(id);
      setAnalysis(reflection?.content || null);

      showSnackbar("🧠 AI-advies bijgewerkt", "success");
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

  return (
    <div
      className={`border rounded-xl p-6 bg-white dark:bg-gray-900 shadow-lg relative
      ${justUpdated ? "ring-2 ring-purple-500 ring-offset-2" : ""}`}
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

      {/* 🧠 AI RESULTAAT */}
      {analysis && (
        <div className="mt-4 p-4 rounded-lg bg-purple-50 text-purple-700 text-sm">
          <Bot className="inline w-4 h-4 mr-1" />
          <strong>AI-analyse:</strong>
          <p className="mt-1">{analysis.summary}</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleAnalyze}
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
