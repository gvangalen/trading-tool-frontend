'use client';

import { toast } from 'react-hot-toast';
import { useState } from 'react';
import SetupEditModal from '@/components/setup/SetupEditModal';
import { generateExplanation } from '@/lib/api/setups';
import AILoader from '@/components/ui/AILoader';

export default function SetupList({
  setups = [],
  loading,
  error,
  searchTerm = '',
  saveSetup,
  removeSetup,
  reload,
}) {
  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSetup, setSelectedSetup] = useState(null);

  // AI loading per ID
  const [aiLoading, setAiLoading] = useState({});
  const [justUpdated, setJustUpdated] = useState({});

  // ---------------------------------------------------------
  // 🔍 FILTER SETUPS
  // ---------------------------------------------------------
  const filteredSetups = !searchTerm
    ? setups
    : setups.filter((s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // ---------------------------------------------------------
  // 🤖 GENERATE AI EXPLANATION (met AILoader overlay)
  // ---------------------------------------------------------
  async function handleGenerateExplanation(id) {
    try {
      setAiLoading((prev) => ({ ...prev, [id]: true }));

      await generateExplanation(id);

      toast.success('AI-uitleg opgeslagen');

      // Highlight effect
      setJustUpdated((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setJustUpdated((prev) => ({ ...prev, [id]: false }));
      }, 2500);

      if (reload) await reload();

    } catch (err) {
      console.error(err);
      toast.error('❌ Fout bij AI-generatie');
    } finally {
      setAiLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  // ---------------------------------------------------------
  // 🗑️ VERWIJDEREN
  // ---------------------------------------------------------
  async function handleRemove(id) {
    try {
      await removeSetup(id);
      toast.success('Setup verwijderd');

      if (reload) await reload();
    } catch (err) {
      console.error(err);
      toast.error('Verwijderen mislukt.');
    }
  }

  // ---------------------------------------------------------
  // ✏️ MODAL OPENEN
  // ---------------------------------------------------------
  function openEditModal(setup) {
    setSelectedSetup(setup);
    setModalOpen(true);
  }

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="space-y-6 mt-4">

      <SetupEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        setup={selectedSetup}
        reload={reload}
      />

      {loading && <p className="text-sm text-gray-500">📡 Setups laden...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSetups.length > 0 ? (
          filteredSetups.map((setup) => {
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
                className={`
                  relative border rounded-lg p-4 bg-white dark:bg-gray-900 shadow transition-all
                  ${justUpdated[setup.id] ? 'ring-2 ring-green-500 ring-offset-2' : ''}
                `}
              >

                {/* AI overlay */}
                {aiLoading[setup.id] && (
                  <div className="
                    absolute inset-0 
                    bg-white/40 dark:bg-black/30 
                    backdrop-blur-sm 
                    z-20 
                    rounded-lg 
                    flex items-center justify-center
                  ">
                    <AILoader
                      variant="dots"
                      size="md"
                      text="AI-uitleg genereren…"
                    />
                  </div>
                )}

                {/* FAVORIET */}
                <button
                  className="absolute top-3 right-3 text-2xl"
                  onClick={() => openEditModal({ ...setup, favorite: !setup.favorite })}
                >
                  {setup.favorite ? '⭐️' : '☆'}
                </button>

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

                {/* AI BUTTON */}
                <button
                  onClick={() => handleGenerateExplanation(setup.id)}
                  disabled={aiLoading[setup.id]}
                  className={`text-xs px-3 py-1 rounded mb-2 text-white 
                    ${aiLoading[setup.id]
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'}
                  `}
                >
                  {aiLoading[setup.id] ? '⏳ Bezig...' : '🤖 Genereer uitleg (AI)'}
                </button>

                {/* ACTIONS */}
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
          <p className="text-sm text-gray-500">📭 Geen setups gevonden.</p>
        )}
      </div>
    </div>
  );
}
