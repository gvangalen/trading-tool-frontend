'use client';

import { useEffect, useState } from 'react';
import { ButtonSmall } from '@/components/ui/ButtonSmall';

export default function SetupInspector() {
  const [open, setOpen] = useState(false);
  const [setups, setSetups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadSetups();
    }
  }, [open]);

  async function loadSetups() {
    setLoading(true);
    try {
      const res = await fetch('/api/score/setup');
      if (!res.ok) throw new Error('Fout bij ophalen');
      const data = await res.json();
      setSetups(data.setups || []);
    } catch (err) {
      console.error('❌ Error loading setups:', err);
      setSetups([]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <ButtonSmall onClick={() => setOpen(true)}>
        🔍 Bekijk beste setup scores
      </ButtonSmall>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-5xl w-full relative overflow-y-auto max-h-[90vh] space-y-6">
        <h2 className="text-2xl font-bold">📋 Setup Inspector</h2>

        {loading && <p className="text-gray-500">📡 Setups laden...</p>}

        {!loading && setups.length === 0 && (
          <p className="text-gray-500">⚠️ Geen actieve setups gevonden.</p>
        )}

        {!loading && setups.length > 0 && (
          <div className="space-y-4">
            {setups
              .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
              .map((setup) => (
                <div key={setup.id} className="p-4 border rounded bg-gray-50 dark:bg-gray-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{setup.name || 'Onbekende setup'}</h3>
                    <span className="text-green-600 font-bold">
                      🔥 Score: {setup.score ?? '–'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 italic">{setup.explanation || 'Geen uitleg beschikbaar.'}</p>
                  {setup.indicators && (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {Object.entries(setup.indicators).map(([key, val]) => (
                        <li key={key}>
                          <strong>{key}</strong>: {val?.value ?? '-'} → <code>score {val?.score ?? '-'}</code>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Sluitknop */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white text-xl"
          title="Sluiten"
        >
          ❌
        </button>
      </div>
    </div>
  );
}
