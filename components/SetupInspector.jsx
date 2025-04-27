'use client';

import { useEffect, useState } from 'react';

export default function SetupInspector({ visible, onClose }) {
  const [setups, setSetups] = useState([]);

  useEffect(() => {
    if (visible) {
      loadSetups();
    }
  }, [visible]);

  async function loadSetups() {
    try {
      const res = await fetch('/api/setups');
      const data = await res.json();
      setSetups(data);
    } catch (err) {
      console.error('❌ Error loading setups:', err);
      setSetups([]);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-4xl w-full relative">
        <h2 className="text-2xl font-bold mb-4">📋 Setup Inspector</h2>

        {setups.length === 0 && (
          <p className="text-gray-500">📡 Laden of geen setups beschikbaar...</p>
        )}

        <div className="overflow-y-auto max-h-[60vh] space-y-4">
          {setups.map((setup) => (
            <div key={setup.id} className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold">{setup.name}</h3>
              <p className="text-sm text-gray-600">📉 {setup.indicators}</p>
              <p className="text-sm text-gray-600">📊 Trend: {setup.trend}</p>
              {setup._score && (
                <p className="text-sm font-bold mt-1">
                  🔥 Score: <span className="text-green-600">{setup._score}</span>
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"
        >
          ❌ Sluiten
        </button>
      </div>
    </div>
  );
}
