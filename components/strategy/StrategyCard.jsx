"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  updateStrategy,
  deleteStrategy,
  generateStrategy,
  fetchStrategyBySetup,
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

  const { openConfirm } = useModal();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [softWarning, setSoftWarning] = useState("");
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    setError("");
    setSoftWarning("");
  }, [strategy]);

  const {
    id = null,
    setup_id = null,
    setup_name = "",
    symbol = "",
    timeframe = "",
    strategy_type = "",
    entry = "",
    targets = [],
    stop_loss = "",
    ai_explanation = "",
    favorite = false,
  } = strategy || {};

  const isDCA = strategy_type === "dca";
  const display = (v) => (v ? v : "-");

  /* ================================================================
     🟪 EDIT STRATEGY — via ModalProvider
  ================================================================ */
  const handleSave = async (payload) => {
    try {
      await updateStrategy(strategy.id, payload);
      onUpdated && onUpdated(strategy.id);
    } catch (err) {
      console.error("❌ Strategie opslaan mislukt:", err);
    }
  };

  const openEditModal = () => {
    const type = String(strategy.strategy_type).toLowerCase();

    let form = null;

    if (type === "trading") {
      form = (
        <StrategyFormTrading
          mode="edit"
          hideSubmit
          initialData={strategy}
          onSubmit={handleSave}
        />
      );
    } else if (type === "dca") {
      form = (
        <StrategyFormDCA
          mode="edit"
          hideSubmit
          initialData={strategy}
          onSubmit={handleSave}
        />
      );
    } else {
      form = (
        <StrategyFormManual
          mode="edit"
          hideSubmit
          initialData={strategy}
          onSubmit={handleSave}
        />
      );
    }

    openConfirm({
      title: `Strategie bewerken – ${strategy.setup_name}`,
      icon: <Pencil />,
      tone: "primary",
      confirmText: "Opslaan",
      cancelText: "Annuleren",
      description: <div className="space-y-6">{form}</div>,
      onConfirm: async () => {
        document.querySelector("#strategy-edit-submit")?.click();
      },
    });
  };

  /* ================================================================
     🔥 DELETE STRATEGY — via ModalProvider
  ================================================================ */
  const openDeleteModal = () => {
    openConfirm({
      title: "Strategie verwijderen",
      icon: <Trash2 />,
      tone: "danger",
      confirmText: "Verwijderen",
      cancelText: "Annuleren",
      description: (
        <p className="leading-relaxed">
          Weet je zeker dat je deze strategie wilt verwijderen?
          <br />
          <span className="text-red-600 font-medium">
            Dit kan niet ongedaan worden gemaakt.
          </span>
        </p>
      ),
      onConfirm: async () => {
        try {
          setLoading(true);
          await deleteStrategy(id);
          onUpdated && onUpdated(id);
        } catch (err) {
          console.error("❌ Delete fout:", err);
          setError("Verwijderen mislukt.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  /* ================================================================
     🤖 AI GENERATE
  ================================================================ */
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setSoftWarning("");

      const res = await generateStrategy(setup_id, true);

      if (!res?.task_id) {
        setError("❌ Ongeldige response van de server.");
        setLoading(false);
        return;
      }

      const taskId = res.task_id;
      let attempts = 0;
      const maxAttempts = 40;
      let status = null;

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 1500));
        status = await fetchTaskStatus(taskId);

        if (!status || Object.keys(status).length === 0) {
          attempts++;
          continue;
        }

        if (status.state === "FAILURE") {
          throw new Error("Celery task mislukt");
        }

        if (status.state === "SUCCESS" || status?.result?.success) {
          break;
        }

        attempts++;
      }

      if (!status || status.state !== "SUCCESS") {
        setSoftWarning("⚠️ AI duurde lang — data wordt opgehaald...");
      }

      const final = await fetchStrategyBySetup(setup_id);

      if (!final?.strategy) {
        throw new Error("Strategie opgehaald maar niet gevonden");
      }

      onUpdated && onUpdated(final.strategy);

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2500);
    } catch (err) {
      console.error("❌ AI fout:", err);
      setError("AI generatie mislukt.");
    } finally {
      setLoading(false);
    }
  };

  /* ================================================================
     🎨 UI
  ================================================================ */
  return (
    <div
      className={`
        border rounded-xl p-6 bg-white dark:bg-gray-900 shadow-lg relative
        transition-all duration-300
        ${justUpdated ? "ring-2 ring-green-500 ring-offset-2" : ""}
      `}
    >
      {/* AI LOADER */}
      {loading && (
        <div
          className="
            absolute inset-0 z-20
            bg-white/40 dark:bg-black/40 backdrop-blur-sm
            flex items-center justify-center rounded-xl
          "
        >
          <AILoader variant="dots" size="md" text="AI strategie genereren…" />
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl text-[var(--text-dark)] dark:text-white">
          {setup_name}
        </h3>

        <div className="flex gap-4">
          <button
            disabled={loading}
            onClick={openEditModal}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <button
            disabled={loading}
            onClick={openDeleteModal}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* META INFO */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span className="uppercase font-medium">{strategy_type}</span> |{" "}
        {symbol} {timeframe}
      </p>

      {/* ENTRY / TARGETS / SL */}
      {!isDCA && (
        <div className="text-sm space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <ArrowRightLeft className="w-4 h-4 text-blue-500" />
            <span>Entry: {display(entry)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Target className="w-4 h-4 text-red-500" />
            <span>
              Targets: {Array.isArray(targets) ? targets.join(", ") : "-"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <ShieldAlert className="w-4 h-4 text-purple-500" />
            <span>Stop-loss: {display(stop_loss)}</span>
          </div>
        </div>
      )}

      {/* AI INSIGHT */}
      {ai_explanation && (
        <div
          className="
          flex gap-3 p-4 rounded-xl
          bg-purple-50 dark:bg-purple-900/20
          border border-purple-200 dark:border-purple-700
          text-sm text-purple-700 dark:text-purple-300
          leading-relaxed mt-4
        "
        >
          <Bot className="w-5 h-5 flex-shrink-0 mt-[2px]" />
          <div>
            <strong className="font-semibold">AI Insight:</strong>
            <br />
            {ai_explanation}
          </div>
        </div>
      )}

      {/* SOFT WARNING */}
      {softWarning && (
        <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-3">
          {softWarning}
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-600 text-sm mt-3">{error}</p>
      )}

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={loading}
          onClick={handleGenerate}
          className="
            flex items-center gap-2 text-sm
            text-purple-600 hover:text-purple-800 underline
            disabled:opacity-50
          "
        >
          <Wand2 className="w-4 h-4" />
          Genereer strategie (AI)
        </button>

        <div className="text-yellow-500">
          {favorite ? (
            <Star className="w-5 h-5" />
          ) : (
            <StarOff className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}
