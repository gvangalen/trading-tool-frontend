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

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  // Laad setups opnieuw als strategyType of searchTerm verandert
  useEffect(() => {
    // Bij manual en trading strategy types sluiten we 'dca' uit
    const excludeDca = (strategyType === 'manual' || strategyType === 'trading') ? ['dca'] : [];
    loadSetups(strategyType, excludeDca);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyType, searchTerm]);

  // Filter en sorteer setups
  const filteredSortedSetups = () => {
    let list = [...setups];

    if (filter !== 'all') {
      list = list.filter((s) => s.trend === filter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((s) => (s.name || '').toLowerCase().includes(q));
    }

    if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  };

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
        const newEditing = { ...prev };
        delete newEditing[id];
        return newEditing;
      });
      if (onUpdated) await onUpdated();
      toast.success('Setup succesvol opgeslagen');
    } catch (error) {
      toast.error('Opslaan mislukt');
      console.error('❌ saveSetup error:', error);
    }
  }

  async function handleGenerateExplanation(id) {
    try {
      await generateExplanation(id);
      toast.success('Uitleg gegenereerd!');
      await loadSetups(strategyType); // forceer refresh van lijst met filter
      if (onUpdated) await onUpdated();
    } catch (err) {
      console.error('❌ Fout bij AI-explanation:', err);
      toast.error('Fout bij uitleg genereren.');
    }
  }

  async function handleRemove(id) {
    try {
      await removeSetup(id);
      toast.success('Setup verwijderd');
      if (onUpdated) await onUpdated();
    } catch (err) {
      toast.error('Verwijderen mislukt.');
      console.error('❌ removeSetup error:', err);
    }
  }

  function toggleFavorite(id, current) {
    // Let op: handleSave is async, hier niet awaited — dat kan oké zijn
    handleEditChange(id, 'favorite', !current);
    handleSave(id);
  }

  const setupsToShow = filteredSortedSetups();

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded bg-white"
          aria-label="Filter setups op trend"
        >
          <option value="all">🔁 Alle trends</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutraal</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded bg-white"
          aria-label="Sorteer setups"
        >
          <option value="name">🔤 Sorteer op naam</option>
        </select>
      </div>

      {loading && <div className="text-gray-500 text-sm">📡 Laden setups...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {setupsToShow.length > 0 ? (
          setupsToShow.map((setup) => {
            const isEditing = editingId === setup.id;
            const trendColor =
              setup.trend === 'bullish'
                ? 'text-green-600'
                : setup.trend === 'bearish'
                ? 'text-red-500'
                : 'text-yellow-500';

            // Gebruik bewerkte waarden als die er zijn, anders originele
            const editingData = editingValues[setup.id] || {};

            return (
              <div
                key={setup.id}
                className="border rounded-lg p-4 bg-white shadow relative transition"
              >
                {/* ⭐ Favoriet */}
                <button
                  className="absolute top-3 right-3 text-2xl"
                  onClick={() => toggleFavorite(setup.id, setup.favorite)}
                  aria-label={`Toggle favoriet voor ${setup.name}`}
                >
                  {setup.favorite ? '⭐️' : '☆'}
                </button>

                {isEditing ? (
                  <>
                    <input
                      className="border p-2 rounded w-full mb-2 font-semibold"
                      defaultValue={editingData.name ?? setup.name}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'name', e.target.value)
                      }
                    />
                    <input
                      className="border p-2 rounded w-full mb-2"
                      defaultValue={editingData.indicators ?? setup.indicators}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'indicators', e.target.value)
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
                      defaultValue={editingData.score ?? setup.score}
                      type="number"
                      onChange={(e) =>
                        handleEditChange(setup.id, 'score', e.target.value)
                      }
                    />
                    <input
                      className="border p-2 rounded w-full mb-2"
                      placeholder="Score logica"
                      defaultValue={editingData.score_logic ?? setup.score_logic}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'score_logic', e.target.value)
                      }
                    />
                    <input
                      className="border p-2 rounded w-full mb-2"
                      placeholder="Timeframe"
                      defaultValue={editingData.timeframe ?? setup.timeframe}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'timeframe', e.target.value)
                      }
                    />
                    <input
                      className="border p-2 rounded w-full mb-2"
                      placeholder="Symbol"
                      defaultValue={editingData.symbol ?? setup.symbol}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'symbol', e.target.value)
                      }
                    />
                    <input
                      className="border p-2 rounded w-full mb-2"
                      placeholder="Strategy type"
                      defaultValue={editingData.strategy_type ?? setup.strategy_type}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'strategy_type', e.target.value)
                      }
                    />
                    <input
                      className="border p-2 rounded w-full mb-2"
                      placeholder="Account type"
                      defaultValue={editingData.account_type ?? setup.account_type}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'account_type', e.target.value)
                      }
                    />
                    <input
                      className="border p-2 rounded w-full mb-2"
                      placeholder="Tags (komma's)"
                      defaultValue={((editingData.tags ?? setup.tags) || []).join(', ')}
                      onChange={(e) =>
                        handleEditChange(
                          setup.id,
                          'tags',
                          e.target.value.split(',').map((tag) => tag.trim())
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
                    <h3 className="font-bold text-lg mb-1">{setup.name}</h3>
                    <p className="text-sm mb-1 text-gray-700">{setup.indicators}</p>
                    <p className={`text-xs mb-1 ${trendColor}`}>📊 {setup.trend}</p>
                    <p className="text-xs text-gray-500 mb-1">
                      ⏱️ {setup.timeframe} | 💼 {setup.account_type} | 🧠 {setup.strategy_type}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">💰 Min: €{setup.min_investment}</p>
                    <p className="text-xs text-gray-500 mb-1">
                      🔁 Dynamic: {setup.dynamic_investment ? '✅' : '❌'}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      📈 Score: {setup.score} ({setup.score_logic})
                    </p>
                    <p className="text-xs text-gray-500 mb-1">🏷️ Tags: {(setup.tags || []).join(', ')}</p>

                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border mb-2">
                      💬 {setup.explanation || 'Geen uitleg beschikbaar.'}
                    </div>

                    <button
                      onClick={() => handleGenerateExplanation(setup.id)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded mb-2"
                    >
                      🔁 Genereer uitleg (AI)
                    </button>

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
            📭 Geen setups gevonden. Voeg een nieuwe toe via het formulier hieronder.
          </p>
        )}
      </div>
    </div>
  );
}
