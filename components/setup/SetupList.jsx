'use client';

import { toast } from 'react-hot-toast';
import { useState } from 'react';
import SetupEditModal from '@/components/setup/SetupEditModal';
import { generateExplanation } from '@/lib/api/setups';
import AILoader from '@/components/ui/AILoader';

// Nieuwe Lucide Icons
import {
  Star,
  StarOff,
  Bot,
  TrendingUp,
  TrendingDown,
  Scale,
  Clock,
  User,
  Brain,
  DollarSign,
  Tag,
  Pencil,
  Trash,
} from 'lucide-react';

export default function SetupList({
  setups = [],
  loading,
  error,
  searchTerm = '',
  saveSetup,
  removeSetup,
  reload,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSetup, setSelectedSetup] = useState(null);

  // AI loading per ID
  const [aiLoading, setAiLoading] = useState({});
  const [justUpdated, setJustUpdated] = useState({});

  // ---------------------------------------------------------
  // 🔍 FILTERS
  // ---------------------------------------------------------
  const filteredSetups = !searchTerm
    ? setups
    : setups.filter((s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // ---------------------------------------------------------
  // 🤖 AI EXPLANATION GENERATOR
  // ---------------------------------------------------------
  async function handleGenerateExplanation(id) {
    try {
      setAiLoading((p) => ({ ...p, [id]: true }));
      await generateExplanation(id);

      toast.success('AI-uitleg opgeslagen');

      // highlight effect
      setJustUpdated((p) => ({ ...p, [id]: true }));
      setTimeout(() => {
        setJustUpdated((p) => ({ ...p, [id]: false }));
      }, 2000);

      reload && reload();
    } catch (err) {
      console.error(err);
      toast.error('❌ AI generatie mislukt');
    } finally {
      setAiLoading((p) => ({ ...p, [id]: false }));
    }
  }

  // ---------------------------------------------------------
  // 🗑️ DELETE SETUP
  // ---------------------------------------------------------
  async function handleRemove(id) {
    try {
      await removeSetup(id);
      toast.success('Setup verwijderd');
      reload && reload();
    } catch (err) {
      console.error(err);
      toast.error('Verwijderen mislukt');
    }
  }

  // ---------------------------------------------------------
  // ✏️ EDIT MODAL
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

            const trendIcon =
              trend === 'bullish'
                ? <TrendingUp size={16} className="text-green-600" />
                : trend === 'bearish'
                ? <TrendingDown size={16} className="text-red-600" />
                : <Scale size={16} className="text-yellow-600" />;

            return (
              <div
                key={setup.id}
                className={`
                  relative rounded-2xl p-5 
                  border border-[var(--card-border)]
                  bg-[var(--card-bg)] shadow-sm

                  transition-all duration-200
                  hover:shadow-md hover:-translate-y-[2px]

                  ${justUpdated[setup.id] ? 'ring-2 ring-green-500' : ''}
                `}
              >
                {/* AI overlay */}
                {aiLoading[setup.id] && (
                  <div className="
                    absolute inset-0 rounded-2xl
                    bg-white/50 dark:bg-black/40
                    backdrop-blur-sm z-20 
                    flex items-center justify-center
                  ">
                    <AILoader
                      variant="dots"
                      size="md"
                      text="AI-analyse..."
                    />
                  </div>
                )}

                {/* Favoriet */}
                <button
                  onClick={() => openEditModal({ ...setup, favorite: !setup.favorite })}
                  className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 transition"
                >
                  {setup.favorite ? (
                    <Star size={20} className="text-yellow-500" />
                  ) : (
                    <StarOff size={20} />
                  )}
                </button>

                {/* Titel */}
                <h3 className="font-bold text-lg text-[var(--text-dark)] mb-2">
                  {setup.name}
                </h3>

                {/* Trend */}
                <div className="flex items-center gap-2 mb-1 text-sm">
                  {trendIcon}
                  <span className="text-[var(--text-light)]">
                    {setup.trend || 'Onbekend'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs text-[var(--text-light)]">
                  <div className="flex items-center gap-2">
                    <Clock size={14} /> {setup.timeframe}
                  </div>

                  <div className="flex items-center gap-2">
                    <User size={14} /> {setup.account_type}
                  </div>

                  <div className="flex items-center gap-2">
                    <Brain size={14} /> {setup.strategy_type}
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign size={14} />
                    Min: €{setup.min_investment ?? 0}
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    {(setup.tags || []).join(', ') || 'Geen tags'}
                  </div>
                </div>

                {/* Uitleg */}
                <div className="
                  text-xs text-[var(--text-light)]
                  bg-[var(--bg-soft)] p-3 rounded-xl border border-[var(--border)]
                  mt-3
                ">
                  {setup.explanation || 'Geen uitleg beschikbaar.'}
                </div>

                {/* AI knop */}
                <button
                  onClick={() => handleGenerateExplanation(setup.id)}
                  disabled={aiLoading[setup.id]}
                  className={`
                    mt-3 flex items-center gap-2 w-full justify-center
                    px-3 py-2 rounded-xl text-xs font-medium text-white
                    bg-[var(--primary)] hover:bg-[var(--primary-dark)]
                    transition

                    disabled:bg-gray-400 disabled:cursor-not-allowed
                  `}
                >
                  <Bot size={15} />
                  {aiLoading[setup.id] ? 'Bezig…' : 'Genereer AI-uitleg'}
                </button>

                {/* Acties */}
                <div className="flex justify-end gap-2 mt-4">

                  <button
                    onClick={() => openEditModal(setup)}
                    className="
                      flex items-center gap-1 px-3 py-1 rounded-lg text-sm
                      bg-blue-500 hover:bg-blue-600 text-white
                    "
                  >
                    <Pencil size={14} />
                    Bewerken
                  </button>

                  <button
                    onClick={() => handleRemove(setup.id)}
                    className="
                      flex items-center gap-1 px-3 py-1 rounded-lg text-sm
                      bg-red-500 hover:bg-red-600 text-white
                    "
                  >
                    <Trash size={14} />
                    Verwijder
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
