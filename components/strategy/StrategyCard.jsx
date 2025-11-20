'use client';

import { useState, useEffect } from 'react';
import {
  updateStrategy,
  deleteStrategy,
  generateStrategy,
  fetchStrategyBySetup,
  fetchTaskStatus,
} from '@/lib/api/strategy';

import StrategyEditModal from '@/components/strategy/StrategyEditModal';

export default function StrategyCard({ strategy, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    setError('');
  }, [strategy]);

  const {
    id,
    setup_id,
    setup_name,
    symbol,
    timeframe,
    strategy_type,
    entry,
    targets,
    stop_loss,
    ai_explanation,
    favorite,
  } = strategy;

  const isDCA = strategy_type === 'dca';

  // -------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------
  const handleDelete = async () => {
    if (!confirm('Weet je zeker dat je deze strategie wilt verwijderen?')) return;

    try {
      setLoading(true);
      await deleteStrategy(id);
      onUpdated && onUpdated(id);
    } catch (err) {
      console.error('❌ Delete fout:', err);
      setError('Verwijderen mislukt');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // AI GENERATE STRATEGY
  // -------------------------------------------------------------
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await generateStrategy(setup_id, true);

      if (!res?.task_id) {
        setError('❌ Ongeldige respons van server.');
        setLoading(false);
        return;
      }

      let attempts = 0;
      let ready = false;

      while (!ready && attempts < 25) {
        await new Promise((r) => setTimeout(r, 1500));
        const status = await fetchTaskStatus(res.task_id);

        if (status?.state === 'SUCCESS') {
          ready = true;
          break;
        }
        if (status?.state === 'FAILURE') {
          throw new Error('Celery task mislukt');
        }

        attempts++;
      }

      if (!ready) throw new Error('AI duurde te lang');

      const final = await fetchStrategyBySetup(setup_id);

      onUpdated && onUpdated(final.strategy);

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2500);

    } catch (err) {
      console.error('❌ AI fout:', err);
      setError('AI generatie mislukt.');
    } finally {
      setLoading(false);
    }
  };

  const display = (v) =>
    v !== null && v !== undefined && v !== '' ? v : '-';

  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  return (
    <>
      <StrategyEditModal
        open={editing}
        strategy={strategy}
        onClose={() => setEditing(false)}
        reload={onUpdated}
      />

      <div
        className={`
          border rounded-xl p-5 bg-white dark:bg-gray-900 shadow-lg relative
          transition-all duration-300
          ${justUpdated ? 'ring-2 ring-green-500 ring-offset-2' : ''}
        `}
      >

        {/* AI Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-purple-700 dark:text-purple-300 font-medium">
                AI strategie genereren…
              </p>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg">{setup_name}</h3>

          <div className="flex gap-4 text-xl">
            <button
              disabled={loading}
              onClick={() => setEditing(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              ✏️
            </button>
            <button
              disabled={loading}
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              🗑️
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span className="uppercase font-medium">{strategy_type}</span> | {symbol} {timeframe}
        </p>

        {/* ENTRY + TARGETS (niet voor DCA) */}
        {!isDCA && (
          <div className="text-sm space-y-1 mb-3">
            <p>🎯 Entry: {display(entry)}</p>
            <p>🎯 Targets: {Array.isArray(targets) ? targets.join(', ') : '-'}</p>
            <p>🛡️ Stop-loss: {display(stop_loss)}</p>
          </div>
        )}

        {/* AI EXPLANATION — ENIGE UITLEG */}
        {ai_explanation && (
          <div className="
            text-xs text-purple-600 dark:text-purple-300
            italic bg-purple-50 dark:bg-purple-900/20
            border border-purple-200 dark:border-purple-700
            p-3 rounded-lg whitespace-pre-line leading-relaxed
            mt-3
          ">
            🤖 <strong>AI Insight:</strong><br />
            {ai_explanation}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={loading}
            onClick={handleGenerate}
            className="
              text-sm text-purple-600 hover:text-purple-800 underline
              disabled:opacity-50
            "
          >
            🔁 Genereer strategie (AI)
          </button>

          <div className="text-yellow-500 text-xl">
            {favorite ? '⭐' : '☆'}
          </div>
        </div>

      </div>
    </>
  );
}
