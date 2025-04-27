'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import { ButtonSmall } from '@/components/ui/ButtonsSmall';

export default function SetupInspector() {
  const [open, setOpen] = useState(false);
  const [setups, setSetups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSetups();
    }
  }, [open]);

  async function fetchSetups() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/score/setup`);
      const data = await res.json();
      setSetups(data.setups || []);
    } catch (err) {
      console.error('❌ Fout bij ophalen van setups:', err);
      setSetups([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* 🔍 Open knop */}
      <ButtonSmall onClick={() => setOpen(true)}>🔍 Bekijk Setup Inspector</ButtonSmall>

      {/* 🧩 Popup overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 space-y-4 relative">
            <h3 className="text-xl font-bold mb-4">📋 Setup Inspector</h3>

            {loading ? (
              <p className="text-gray-500">📡 Setups laden...</p>
            ) : setups.length === 0 ? (
              <p className="text-gray-500">⚠️ Geen actieve setups gevonden.</p>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {setups.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).map(setup => (
                  <div key={setup.id} className="border rounded p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{setup.name || 'Naam onbekend'}</div>
                      <div className="font-bold">{setup.score ?? '-'}</div>
                    </div>
                    <p className="text-gray-500 text-sm">{setup.explanation || 'Geen uitleg beschikbaar'}</p>
                    {setup.indicators && (
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
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

            {/* ❌ Sluit knop */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
              aria-label="Sluiten"
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </>
  );
}
