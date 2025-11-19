'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSetupData } from '@/hooks/useSetupData';
import { generateExplanation } from '@/lib/api/setups';

export default function SetupList({ searchTerm = '', strategyType = '', reloadSetups }) {
  const {
    setups,
    loading,
    error,
    saveSetup,
    removeSetup,
    loadSetups,
  } = useSetupData();

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // ⭐ default newest first
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const [aiLoading, setAiLoading] = useState({});
  const [aiStatus, setAiStatus] = useState({});

  // ⭐ INITIAL LOAD — altijd volledige lijst ophalen
  useEffect(() => {
    loadSetups(strategyType);
  }, [strategyType]);

  // ⭐ LIVE RELOAD support vanuit parent
  useEffect(() => {
    if (reloadSetups) reloadSetups();
  }, []);

  /** -------------------------------
   *    FILTER + SORT LOGICA
   * -------------------------------- */
  const getFilteredSortedSetups = () => {
    let list = [...setups];

    // 🔍 zoekfunctie
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((s) => (s.name || '').toLowerCase().includes(q));
    }

    // 🎨 trends
    if (filter !== 'all') {
      list = list.filter(
        (s) => (s.trend || '').toLowerCase() === filter.toLowerCase()
      );
    }

    // 🔽 sorteren
    switch (sortBy) {
      case 'name':
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;

      case 'newest':
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;

      case 'favorite':
        list.sort((a, b) => Number(b.favorite) - Number(a.favorite));
        break;
    }

    return list;
  };

  const setupsToShow = getFilteredSortedSetups();

  /** --------------------------------
   *     INLINE BEWERKEN
   * -------------------------------- */
  const handleEditChange = (id, field, value) => {
    setEditingValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id) => {
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

      toast.success('Setup opgeslagen ✨');

      await loadSetups(strategyType);
      if (reloadSetups) reloadSetups();
    } catch (err) {
      toast.error('Opslaan mislukt');
    }
  };

  /** --------------------------------
   *     AI-UITLEG
   * -------------------------------- */
  const handleGenerateExplanation = async (id) => {
    try {
      setAiLoading((prev) => ({ ...prev, [id]: true }));
      setAiStatus((prev) => ({ ...prev, [id]: '⏳ Genereren...' }));

      await generateExplanation(id);

      setAiStatus((prev) => ({ ...prev, [id]: '✅ Uitleg opgeslagen!' }));
      toast.success('AI-uitleg geüpdatet');

      await loadSetups(strategyType);

      if (reloadSetups) reloadSetups();
    } catch (err) {
      setAiStatus((prev) => ({ ...prev, [id]: '❌ Fout' }));
      toast.error('Fout bij genereren');
    } finally {
      setTimeout(() => {
        setAiLoading((prev) => ({ ...prev, [id]: false }));
        setAiStatus((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }, 3000);
    }
  };

  /** --------------------------------
   *     VERWIJDEREN
   * -------------------------------- */
  const handleRemove = async (id) => {
    try {
      await removeSetup(id);
      toast.success('Setup verwijderd 🗑️');

      await loadSetups(strategyType);
      if (reloadSetups) reloadSetups();
    } catch (err) {
      toast.error('Verwijderen mislukt');
    }
  };

  const toggleFavorite = (id, current) => {
    handleEditChange(id, 'favorite', !current);
    handleSave(id);
  };

  /** --------------------------------
   *     LOADING SKELETONS
   * -------------------------------- */
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse border rounded-lg p-4 shadow bg-gray-100">
          <div className="h-4 w-2/3 bg-gray-300 rounded mb-3"></div>
          <div className="h-3 w-1/2 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-1/3 bg-gray-300 rounded mb-6"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  /** --------------------------------
   *     RENDER
   * -------------------------------- */
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
          <option value="range">⚖️ Range</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded bg-white"
        >
          <option value="newest">🆕 Nieuwste eerst</option>
          <option value="name">🔤 Op naam</option>
          <option value="favorite">⭐ Favorieten bovenaan</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <LoadingSkeleton />}

      {/* Errors */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Setup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {!loading && setupsToShow.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full mt-4">
            📭 Geen setups gevonden.
          </p>
        )}

        {!loading &&
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
                {/* ⭐ Favorite */}
                <button
                  className="absolute top-3 right-3 text-2xl"
                  onClick={() => toggleFavorite(setup.id, setup.favorite)}
                >
                  {setup.favorite ? '⭐️' : '☆'}
                </button>

                {/* --------------- EDIT --------------- */}
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
                      type="number"
                      defaultValue={editingData.min_investment ?? setup.min_investment}
                      onChange={(e) =>
                        handleEditChange(setup.id, 'min_investment', e.target.value)
                      }
                    />

                    <label className="text-sm flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        defaultChecked={
                          editingData.dynamic_investment ?? setup.dynamic_investment
                        }
                        onChange={(e) =>
                          handleEditChange(
                            setup.id,
                            'dynamic_investment',
                            e.target.checked
                          )
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
                        💾 Opslaan
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
                    {/* --------------- VIEW --------------- */}
                    <h3 className="font-bold text-lg mb-1">{setup.name}</h3>

                    <p className={`text-xs mb-1 ${trendColor}`}>
                      📊 {setup.trend || 'Onbekend'}
                    </p>

                    <p className="text-xs text-gray-500 mb-1">
                      ⏱️ {setup.timeframe} | 💼 {setup.account_type} | 🧠{' '}
                      {setup.strategy_type}
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

                    {/* AI KNOP */}
                    <button
                      onClick={() => handleGenerateExplanation(setup.id)}
                      disabled={aiLoading[setup.id]}
                      className={`text-xs px-3 py-1 rounded mb-2 text-white 
                        ${
                          aiLoading[setup.id]
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }
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
                        🗑️ Verwijderen
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
