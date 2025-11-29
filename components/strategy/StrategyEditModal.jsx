"use client";

import { useEffect } from "react";

// Formulieren
import StrategyFormTrading from "@/components/strategy/StrategyFormTrading";
import StrategyFormDCA from "@/components/strategy/StrategyFormDCA";
import StrategyFormManual from "@/components/strategy/StrategyFormManual";

// API
import { updateStrategy } from "@/lib/api/strategy";

// Icons (Lucide)
import { X, Save, Pencil } from "lucide-react";

export default function StrategyEditModal({
  open,
  onClose,
  strategy,
  reload,
}) {
  // Escape → sluit modal
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!open || !strategy) return null;

  /* ===========================================================
     SAVE HANDLER
  =========================================================== */
  const handleSave = async (payload) => {
    try {
      await updateStrategy(strategy.id, payload);
      reload();
      onClose();
    } catch (err) {
      console.error("❌ Strategie opslaan mislukt:", err);
      alert("❌ Opslaan mislukt.");
    }
  };

  /* ===========================================================
     FORM SELECTIE
  =========================================================== */
  const type = String(strategy.strategy_type).toLowerCase();

  const form = (() => {
    if (type === "trading")
      return (
        <StrategyFormTrading
          mode="edit"
          hideSubmit={true}
          initialData={strategy}
          onSubmit={handleSave}
        />
      );

    if (type === "dca")
      return (
        <StrategyFormDCA
          mode="edit"
          hideSubmit={true}
          initialData={strategy}
          onSubmit={handleSave}
        />
      );

    return (
      <StrategyFormManual
        mode="edit"
        hideSubmit={true}
        initialData={strategy}
        onSubmit={handleSave}
      />
    );
  })();

  /* ===========================================================
     UI – Fintech PRO Modal
  =========================================================== */
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      {/* Modal container */}
      <div
        className="
          w-full max-w-2xl max-h-[92vh]
          overflow-y-auto
          rounded-2xl 
          bg-white dark:bg-[#0d0d0d]
          border border-gray-200 dark:border-gray-800 
          shadow-2xl
          relative px-6 sm:px-10 py-8
        "
      >
        {/* Sluitknop */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 
            text-gray-600 hover:text-gray-300
            p-2 rounded-lg
            hover:bg-black/20 transition
          "
        >
          <X className="w-5 h-5" />
        </button>

        {/* Titel */}
        <div className="flex items-center gap-3 mb-6">
          <Pencil className="w-6 h-6 text-[var(--primary)]" />
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-dark)]">
            Strategie bewerken – {strategy.setup_name}
          </h2>
        </div>

        {/* FORM */}
        <div className="space-y-6">{form}</div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-300 dark:border-gray-800">
          
          {/* Annuleren */}
          <button
            onClick={onClose}
            className="
              px-5 py-2.5 rounded-xl
              bg-gray-200 hover:bg-gray-300
              dark:bg-gray-800 dark:hover:bg-gray-700
              text-gray-800 dark:text-gray-100
              font-medium shadow-sm
              transition-all
            "
          >
            Annuleren
          </button>

          {/* Opslaan */}
          <button
            onClick={() =>
              document.querySelector("#strategy-edit-submit")?.click()
            }
            className="
              px-6 py-2.5 rounded-xl
              bg-blue-600 hover:bg-blue-700 
              text-white font-semibold 
              shadow-md flex items-center gap-2
              transition-all
            "
          >
            <Save className="w-5 h-5" />
            Opslaan
          </button>

        </div>
      </div>
    </div>
  );
}
