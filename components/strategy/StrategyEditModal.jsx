'use client';

import { useEffect } from 'react';
import StrategyFormTrading from '@/components/strategy/StrategyFormTrading';
import StrategyFormDCA from '@/components/strategy/StrategyFormDCA';
import StrategyFormManual from '@/components/strategy/StrategyFormManual';

export default function StrategyEditModal({ open, onClose, strategy, reload }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  if (!open || !strategy) return null;

  // Kies het juiste form-component
  const type = String(strategy.strategy_type).toLowerCase();

  const renderForm = () => {
    if (type === 'trading')
      return (
        <StrategyFormTrading
          mode="edit"
          initialData={strategy}
          onSaved={() => {
            reload();
            onClose();
          }}
        />
      );

    if (type === 'dca')
      return (
        <StrategyFormDCA
          mode="edit"
          initialData={strategy}
          onSaved={() => {
            reload();
            onClose();
          }}
        />
      );

    return (
      <StrategyFormManual
        mode="edit"
        initialData={strategy}
        onSaved={() => {
          reload();
          onClose();
        }}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="
          bg-white dark:bg-gray-900 rounded-xl shadow-xl 
          w-full max-w-2xl
          max-h-[85vh] overflow-y-auto
          relative p-6
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        {/* Titel */}
        <h2 className="text-xl font-bold mb-4">
          ✏️ Strategie bewerken – {strategy.setup_name}
        </h2>

        {/* FORM */}
        {renderForm()}

        {/* FOOTER BUTTONS */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-md 
              bg-gray-200 hover:bg-gray-300 
              dark:bg-gray-700 dark:hover:bg-gray-600
              text-gray-700 dark:text-gray-200
              font-medium
            "
          >
            ❌ Annuleren
          </button>

          <button
            onClick={() =>
              document.querySelector('#strategy-edit-submit')?.click()
            }
            className="
              px-4 py-2 rounded-md 
              bg-blue-600 hover:bg-blue-700 
              text-white font-semibold
            "
          >
            💾 Opslaan
          </button>
        </div>
      </div>
    </div>
  );
}
