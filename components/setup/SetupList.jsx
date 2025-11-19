'use client';

import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useSetupData } from '@/hooks/useSetupData';
import { generateExplanation } from '@/lib/api/setups';

export default function SetupList({ searchTerm = '', strategyType = '', onUpdated }) {
  const {
    setups,
    loading,
    error,
    saveSetup,
    removeSetup,
    loadSetups,
  } = useSetupData();

  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const [aiLoading, setAiLoading] = useState({});
  const [aiStatus, setAiStatus] = useState({});

  // ⭐ INITIAL LOAD
  useEffect(() => {
    loadSetups(strategyType);
  }, [strategyType]);

  // ⭐ SEARCH
  const filteredSetups = () => {
    let list = [...setups];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((s) =>
        (s.name || '').toLowerCase().includes(q)
      );
    }

    return list;
  };

  // ⭐ Inline editing
  function handleEditChange(id, field, value) {
    setEditingValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  async function handleSave(id) {
    const original = setups.find((s) => s.id === id);
    const updated = { ...original, ...editingValues[id] };

    try {
      await saveSetup(id, updated);
      setEditingId(null);

      setEditingValues((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      await loadSetups(strategyType);
      if (onUpdated) await onUpdated();

      toast.success('Setup succesvol opgeslagen');
    } catch (error) {
      console.error(error);
      toast.error('Opslaan mislukt');
    }
  }

  // ⭐ AI uitleg genereren
  async function handleGenerateExplanation(id) {
    try {
      setAiLoading((prev) => ({ ...prev, [id]: true }));
      setAiStatus((prev) => ({ ...prev, [id]: '⏳ Uitleg wordt gegenereerd...' }));

      await generateExplanation(id);

      setAiStatus((prev) => ({ ...prev, [id]: '✅ Uitleg opgeslagen!' }));
      toast.success('AI-uitleg opgeslagen');

      await loadSetups(strategyType);
      if (onUpdated) await onUpdated();

    } catch (err) {
      console.error(err);
      setAiStatus((prev) => ({ ...prev, [id]: '❌ Fout bij genereren' }));
      toast.error('Fout bij uitleg genereren.');
    } finally {
      setAiLoading((prev) => ({ ...prev, [id]: false }));

      setTimeout(() => {
        setAiStatus((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }, 3500);
    }
  }

  async function handleRemove(id) {
    try {
      await removeSetup(id);

      toast.success('Setup verwijderd');

      await loadSetups(strategyType);
      if (onUpdated) await onUpdated();
    } catch (err) {
      console.error(err);
      toast.error('Verwijderen mislukt.');
    }
  }

  function toggleFavorite(id, current) {
    handleEditChange(id, 'favorite', !current);
    handleSave(id);
  }

  const setupsToShow = filteredSetups();

  return (
    <div className="space-y-6 mt-4">

      {/* Loading */}
      {loading && (
        <div className="text-gray-500 text-sm">📡 Setups laden...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {/* Setup cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {setupsToShow.length > 0 ? (
          setupsToShow.map((setup) => {
            const isEditing = editingId === setup.id;
            const trend = (setup.trend || '').toLowerCase();

            const trendColor =
              trend === 'bullish'
                ? 'text-green-600'
                : trend === 'bearish'
                ? 'text-red-500'
                : 'text-yellow-500';

            const editingData = editingValues[setup.id] || {};

            return (
              <div
                key={setup.id}
                className="border rounded-lg p-4 bg-white shadow relative transition"
              >
                {/* Favorite button */}
                <button
                  className="absolute top-3 right-3 text-2xl"
                  onClick={() => toggleFavorite(setup.id, setup.favorite)}
                >
                  {setup.favorite ? '⭐️' : '☆'}
                </button>

                {/* EDIT MODE */}
                {isEditing ? (
                  <>
                    <input
                      className="border p-2 rounded w-full mb-2 font-semibold"
                      defaultValue={editingData.name ?? setup.name}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'name', e.target.value)
                      }
                    />

                    <textarea
                      className="border p-2 rounded w-full mb-2"
                      defaultValue={editingData.explanation ?? setup.explanation}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'explanation', e.target.value)
                      }
                    />

                    <input
                      className="border p-2 rounded w-full mb-2"
                      defaultValue={editingData.min_investment ?? setup.min_investment}
                      type="number"
                      onChange={(e) =>
                        handleEditChange(setup.id, 'min_investment', e.target.value)
                      }
                    />

                    <label className="text-sm flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        defaultChecked={editingData.dynamic_investment ?? setup.dynamic_investment}
                        onChange={(e) =>
                          handleEditChange(setup.id, 'dynamic_investment', e.target.checked)
                        }
                      />
                      🔁 Dynamische investering
                    </label>

                    <input
                      className="border p-2 rounded w-full mb-2"
                      placeholder="Tags"
                      defaultValue={(editingData.tags ?? setup.tags)?.join(', ')}
                      onChange={(e) =>
                        handleEditChange(
                          setup.id,
                          'tags',
                          e.target.value.split(',').map((t) => t.trim())
                        )
                      }
                    />

                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleSave(setup.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        ✅ Opslaan
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm"
                      >
                        ❌ Annuleren
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* VIEW MODE */}
                    <h3 className="font-bold text-lg mb-1">{setup.name}</h3>

                    <p className={`text-xs mb-1 ${trendColor}`}>
                      📊 {setup.trend || 'Onbekend'}
                    </p>

                    <p className="text-xs text-gray-500 mb-1">
                      ⏱️ {setup.timeframe} | 💼 {setup.account_type} | 🧠 {setup.strategy_type}
                    </p>

                    <p className="text-xs text-gray-500 mb-1">
                      💰 Min investering: €{setup.min_investment ?? 0}
                    </p>

                    <p className="text-xs text-gray-500 mb-1">
                      🔁 Dynamic: {setup.dynamic_investment ? '✅' : '❌'}
                    </p>

                    <p className="text-xs text-gray-500 mb-1">
                      🏷️ Tags: {(setup.tags || []).join(', ')}
                    </p>

                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border mb-2">
                      💬 {setup.explanation || 'Geen uitleg beschikbaar.'}
                    </div>

                    {/* AI BTN */}
                    <button
                      onClick={() => handleGenerateExplanation(setup.id)}
                      disabled={aiLoading[setup.id]}
                      className={`text-xs px-3 py-1 rounded mb-2 text-white 
                        ${aiLoading[setup.id]
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'}
                      `}
                    >
                      {aiLoading[setup.id] ? '⏳ Bezig...' : '🔁 Genereer uitleg (AI)'}
                    </button>

                    {aiStatus[setup.id] && (
                      <p className="text-xs text-gray-600 mt-1">{aiStatus[setup.id]}</p>
                    )}

                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditingId(setup.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        ✏️ Bewerken
                      </button>

                      <button
                        onClick={() => handleRemove(setup.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        ❌ Verwijderen
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 col-span-full mt-4">
            📭 Geen setups gevonden.
          </p>
        )}
      </div>
    </div>
  );
}
