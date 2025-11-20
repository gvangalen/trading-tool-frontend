'use client';

import { useEffect } from 'react';
import StrategyFormTrading from '@/components/strategy/StrategyFormTrading';
import StrategyFormDCA from '@/components/strategy/StrategyFormDCA';
import StrategyFormManual from '@/components/strategy/StrategyFormManual';
import { updateStrategy } from '@/lib/api/strategy';

export default function StrategyEditModal({ open, onClose, strategy, reload }) {
  
  useEffect(() => {
    const esc = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  if (!open || !strategy) return null;

  // -------------------------------------------------------------------
  // 1) UNIFORME SAVE HANDLER
  // -------------------------------------------------------------------
  const handleSave = async (payload) => {
    try {
      await updateStrategy(strategy.id, payload);
      reload();    // lijst opnieuw laden
      onClose();   // modal sluiten
    } catch (err) {
      console.error('❌ Fout bij opslaan strategie:', err);
      alert('❌ Opslaan mislukt.');
    }
  };

  // -------------------------------------------------------------------
  // 2) FORM SELECTIE
  // -------------------------------------------------------------------
  const type = String(strategy.strategy_type).toLowerCase();

  const form = (() => {
    if (type === 'trading')
      return (
        <StrategyFormTrading
          mode="edit"
          hideSubmit={true}
          initialData={strategy}
          onSubmit={handleSave}
        />
      );

    if (type === 'dca')
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

  // -------------------------------------------------------------------
  // 3) UI (TradingView-style modal)
  // -------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">

      <div className="
        bg-white dark:bg-[#111] 
        rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700
        w-full max-w-2xl max-h-[90vh] overflow-y-auto
        relative p-8
      ">

        {/* close btn */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 text-2xl"
        >
          ✖
        </button>

        {/* titel */}
        <h2 className="text-2xl font-bold mb-6">
          ✏️ Strategie bewerken – {strategy.setup_name}
        </h2>

        {/* FORM */}
        {form}

        {/* FOOTER BUTTONS */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
          
          <button
            onClick={onClose}
            className="
              px-5 py-2 rounded-lg
              bg-gray-200 hover:bg-gray-300 
              dark:bg-gray-800 dark:hover:bg-gray-700
              text-gray-800 dark:text-gray-100
            "
          >
            ❌ Annuleren
          </button>

          <button
            onClick={() =>
              document.querySelector('#strategy-edit-submit')?.click()
            }
            className="
              px-6 py-2 rounded-lg
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold shadow
            "
          >
            💾 Opslaan
          </button>
        </div>

      </div>
    </div>
  );
}
