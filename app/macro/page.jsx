'use client';

import { useState } from 'react';
import MacroTabs from '@/components/macro/MacroTabs';
import CardWrapper from '@/components/ui/CardWrapper';

export default function MacroPage() {
  const [editIndicator, setEditIndicator] = useState(null);

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">🌍 Macro Indicatoren</h1>

      {/* 🔁 Nieuw tab-systeem met MacroTabs */}
      <MacroTabs />

      {/* 💬 Bewerk-popup (optioneel uitbreiden later) */}
      {editIndicator && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-lg font-bold">✏️ Bewerk {editIndicator.name}</h3>
            {/* Later: invulvelden */}
            <button
              onClick={() => setEditIndicator(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
