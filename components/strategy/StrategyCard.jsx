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
  const [editing, setEditing] = useState(false);         // ← opent modal
  const [fields, setFields] = useState({ ...strategy });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    setFields({ ...strategy });
  }, [strategy]);

  if (!strategy) return null;

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
    explanation,
    ai_explanation,
    favorite,
  } = strategy;

  const isDCA = strategy_type === 'dca';

  // DELETE
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

  // AI GENERATE
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await generateStrategy(setup_id, true);

      if (!res?.task_id) {
        setError('❌ Ongeldige respons');
        return;
      }

      let attempts = 0;
      let ready = false;

      while (!ready && attempts < 20) {
        await new Promise((r) => setTimeout(r, 1500));
        const status = await fetchTaskStatus(res.task_id);

        if (status?.state === 'SUCCESS') {
          ready = true;
          break;
        }
        if (status?.state === 'FAILURE') {
          throw new Error('Celery taak mislukt');
        }
        attempts++;
      }

      if (!ready) throw new Error('AI duurde te lang');

      const final = await fetchStrategyBySetup(setup_id);
      onUpdated && onUpdated(final.strategy);

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);

    } catch (err) {
      console.error('❌ AI fout:', err);
      setError('Generatie mislukt');
    } finally {
      setLoading(false);
    }
  };

  const display = (v) =>
    v !== null && v !== undefined && v !== '' ? v : '-';

  return (
    <>
      {/* MODAL */}
      <StrategyEditModal
        open={editing}
        strategy={strategy}
        onClose={() => setEditing(false)}
        reload={onUpdated}
      />

      <div
        className={`
          border rounded-lg p-4 bg-white dark:bg-gray-900 shadow-md
          transition
          ${justUpdated ? 'ring-2 ring-green-500 ring-offset-2' : ''}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{setup_name}</h3>

          <div className="flex gap-3">
            <button
              disabled={loading}
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✏️
            </button>

            <button
              disabled={loading}
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              🗑️
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="uppercase font-medium">{strategy_type}</span> | {symbol} {timeframe}
        </p>

        {/* VIEW MODE */}
        <div className="text-sm space-y-1 mb-2">
          {!isDCA && (
            <>
              <p>🎯 Entry: {display(entry)}</p>
              <p>🎯 Targets: {Array.isArray(targets) ? targets.join(', ') : '-'}</p>
              <p>🛡️ Stop-loss: {display(stop_loss)}</p>
            </>
          )}
        </div>

        {explanation && (
          <p className="text-xs text-gray-500 italic py-1">📝 {explanation}</p>
        )}

        {ai_explanation && (
          <p className="text-xs text-purple-500 italic py-1">🤖 {ai_explanation}</p>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={loading}
            onClick={handleGenerate}
            className="text-sm text-purple-600 underline hover:text-purple-800"
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
