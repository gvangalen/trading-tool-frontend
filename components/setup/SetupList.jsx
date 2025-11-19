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

  // 🔄 AI uitleg loading state per setup
  const [aiLoading, setAiLoading] = useState({}); // { setupId: true/false }
  const [aiStatus, setAiStatus] = useState({}); // { setupId: "text" }

  useEffect(() => {
    const excludeDca = (strategyType === 'manual' || strategyType === 'trading') ? ['dca'] : [];
    loadSetups(strategyType, excludeDca);
  }, [strategyType, searchTerm]);

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
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      if (onUpdated) await onUpdated();
      toast.success('Setup succesvol opgeslagen');
    } catch (error) {
      toast.error('Opslaan mislukt');
      console.error('❌ saveSetup error:', error);
    }
  }

  // ✅ NIEUW: AI-UITLEG MET SPINNER + STATUS
  async function handleGenerateExplanation(id) {
    try {
      setAiLoading((prev) => ({ ...prev, [id]: true }));
      setAiStatus((prev) => ({ ...prev, [id]: '⏳ Uitleg wordt gegenereerd...' }));

      await generateExplanation(id);

      // UI feedback
      setAiStatus((prev) => ({ ...prev, [id]: '✅ Uitleg opgeslagen!' }));
      toast.success('AI-uitleg opgeslagen');

      await loadSetups(strategyType);
      if (onUpdated) await onUpdated();
    } catch (err) {
      console.error('❌ Fout bij AI-explanation:', err);
      setAiStatus((prev) => ({ ...prev, [id]: '❌ Fout bij genereren' }));
      toast.error('Fout bij uitleg genereren.');
    } finally {
      setAiLoading((prev) => ({ ...prev, [id]: false }));

      // status na 4 sec weghalen
      setTimeout(() => {
        setAiStatus((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }, 4000);
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
    handleEditChange(id, 'favorite', !current);
    handleSave(id);
  }

  const setupsToShow = filteredSortedSetups();

  return (
    <div className="space-y-6 mt-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded bg-white"
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
        >
          <option value="name">🔤 Sorteer op naam</option>
        </select>
      </div>

      {/* Loading / Error */}
      {loading && <div className="text-gray-500 text-sm">📡 Laden setups...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Setup kaarten */}
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

            const editingData = editingValues[setup.id] || {};

            return (
              <div
                key={setup.id}
                className="border rounded-lg p-4 bg-white shadow relative transition"
              >
                {/* ⭐ Favorite */}
                <button
                  className="absolute top-3 right-3 text-2xl"
                  onClick={() => toggleFavorite(setup.id, setup.favorite)}
                >
                  {setup.favorite ? '⭐️' : '☆'}
                </button>

                {/* ---------- EDIT MODE ---------- */}
                {isEditing ? (
                  <>
                    {/* 🔧 alle velden blijven exact hetzelfde */}
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
                          e.target.value.split(',').map(t => t.trim())
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
                    {/* ---------- VIEW MODE ---------- */}
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

                    <p className="text-xs text-gray-500 mb-1">
                      🏷️ Tags: {(setup.tags || []).join(', ')}
                    </p>

                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border mb-2">
                      💬 {setup.explanation || 'Geen uitleg beschikbaar.'}
                    </div>

                    {/* ⭐⭐⭐ NIEUWE AI BUTTON MET SPINNER + STATUS ⭐⭐⭐ */}
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

                    {/* Status onder knop */}
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
            📭 Geen setups gevonden. Voeg een nieuwe toe via het formulier hieronder.
          </p>
        )}
      </div>
    </div>
  );
}
