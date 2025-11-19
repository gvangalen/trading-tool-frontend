'use client';

import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useSetupData } from '@/hooks/useSetupData';
import { generateExplanation } from '@/lib/api/setups';

// Modal import
import SetupEditModal from '@/components/setup/SetupEditModal';

export default function SetupList({ searchTerm = '', strategyType = '', reloadSetups }) {
  const {
    setups,
    loading,
    error,
    removeSetup,
    loadSetups,
  } = useSetupData();

  const [aiLoading, setAiLoading] = useState({});
  const [aiStatus, setAiStatus] = useState({});

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSetup, setSelectedSetup] = useState(null);

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

  // ⭐ AI uitleg genereren
  async function handleGenerateExplanation(id) {
    try {
      setAiLoading((prev) => ({ ...prev, [id]: true }));
      setAiStatus((prev) => ({ ...prev, [id]: '⏳ Uitleg wordt gegenereerd...' }));

      await generateExplanation(id);

      setAiStatus((prev) => ({ ...prev, [id]: '✅ Uitleg opgeslagen!' }));
      toast.success('AI-uitleg opgeslagen');

      await loadSetups(strategyType);
      if (reloadSetups) await reloadSetups();
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

  // ⭐ Verwijderen
  async function handleRemove(id) {
    try {
      await removeSetup(id);

      toast.success('Setup verwijderd');

      await loadSetups(strategyType);
      if (reloadSetups) await reloadSetups();
    } catch (err) {
      console.error(err);
      toast.error('Verwijderen mislukt.');
    }
  }

  // ⭐ Modal openen voor bewerken
  function openEditModal(setup) {
    setSelectedSetup(setup);
    setModalOpen(true);
  }

  const setupsToShow = filteredSetups();

  return (
    <div className="space-y-6 mt-4">

      {/* Modal */}
      <SetupEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        setup={selectedSetup}
        reload={reloadSetups}
      />

      {/* Loading */}
      {loading && (
        <div className="text-gray-500 text-sm">📡 Setups laden...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {/* Setup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {setupsToShow.length > 0 ? (
          setupsToShow.map((setup) => {
            const trend = (setup.trend || '').toLowerCase();

            const trendColor =
              trend === 'bullish'
                ? 'text-green-600'
                : trend === 'bearish'
                ? 'text-red-500'
                : 'text-yellow-500';

            return (
              <div
                key={setup.id}
                className="border rounded-lg p-4 bg-white shadow relative transition"
              >
                {/* Favoriet */}
                <button
                  className="absolute top-3 right-3 text-2xl"
                  onClick={() => openEditModal({ ...setup, favorite: !setup.favorite })}
                >
                  {setup.favorite ? '⭐️' : '☆'}
                </button>

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
                    onClick={() => openEditModal(setup)}
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
