'use client';

import { useEffect } from 'react';
import StrategyFormTrading from '@/components/strategy/StrategyFormTrading';
import StrategyFormDCA from '@/components/strategy/StrategyFormDCA';
import StrategyFormManual from '@/components/strategy/StrategyFormManual';

export default function StrategyEditModal({ open, onClose, strategy, reload }) {
  // ESC sluit modal
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  if (!open || !strategy) return null;

  const type = String(strategy.strategy_type).toLowerCase();

  // Pick correct form
  const renderForm = () => {
    const sharedProps = {
      mode: 'edit',
      initialData: strategy,
      onSaved: () => {
        reload();
        onClose();
      },
      hideSubmit: true, // ← Hiermee verberg je de blauwe save-knop in het formulier
    };

    if (type === 'trading') return <StrategyFormTrading {...sharedProps} />;
    if (type === 'dca') return <StrategyFormDCA {...sharedProps} />;
    return <StrategyFormManual {...sharedProps} />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <div
        className="
          bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
          w-full max-w-2xl
          max-h-[85vh] overflow-y-auto
          relative 
          p-6 border border-gray-200 dark:border-gray-700
        "
      >
        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-200"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          ✏️ Strategie bewerken 
          <span className="text-gray-500 dark:text-gray-400">
            ({strategy.setup_name})
          </span>
        </h2>

        {/* FORM */}
        {renderForm()}

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-300 dark:border-gray-700">

          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-md 
              bg-gray-200 hover:bg-gray-300 
              dark:bg-gray-700 dark:hover:bg-gray-600
              text-gray-800 dark:text-gray-200 
              font-medium
              shadow-sm
            "
          >
            ❌ Annuleren
          </button>

          <button
            onClick={() =>
              document.querySelector('#strategy-edit-submit')?.click()
            }
            className="
              px-5 py-2 rounded-md 
              bg-blue-600 hover:bg-blue-700 
              text-white font-semibold
              shadow-md
            "
          >
            💾 Opslaan
          </button>

        </div>
      </div>
    </div>
  );
}
