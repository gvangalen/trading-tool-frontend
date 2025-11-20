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

  const display = (v) =>
    v !== null && v !== undefined && v !== '' ? v : '-';

  // DELETE
  const handleDelete = async () => {
    if (!confirm('Weet je zeker dat je deze strategie wilt verwijderen?')) return;

    try {
      setLoading(true);
      await deleteStrategy(id);
      onUpdated && onUpdated(id);
    } catch (err) {
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

      let ready = false;
      let attempts = 0;

      while (!ready && attempts < 20) {
        await new Promise((r) => setTimeout(r, 1500));
        const status = await fetchTaskStatus(res.task_id);

        if (status?.state === 'SUCCESS') ready = true;
        if (status?.state === 'FAILURE') throw new Error('Celery taak mislukt');

        attempts++;
      }

      if (!ready) throw new Error('AI duurde te lang');

      const final = await fetchStrategyBySetup(setup_id);
      onUpdated && onUpdated(final.strategy);

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);
    } catch (err) {
      setError('Generatie mislukt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* EDIT MODAL */}
      <StrategyEditModal
        open={editing}
        strategy={strategy}
        onClose={() => setEditing(false)}
        reload={onUpdated}
      />

      <div
        className={`
          bg-white dark:bg-gray-900 
          border rounded-xl shadow-md p-5 
          transition-all
          ${justUpdated ? 'ring-2 ring-green-500 ring-offset-2' : ''}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{setup_name}</h3>

            <div className="flex gap-2 mt-1">
              <span className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200">
                {strategy_type.toUpperCase()}
              </span>

              <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700">
                {symbol}
              </span>

              <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700">
                {timeframe}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 text-xl">
            <button
              onClick={() => setEditing(true)}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-red-600 hover:text-red-800"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-3 text-sm">
          {!isDCA && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-gray-400 text-xs">Entry</p>
                <p className="font-medium">{display(entry)}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Targets</p>
                <p className="font-medium">
                  {Array.isArray(targets) ? targets.join(', ') : '-'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Stop-loss</p>
                <p className="font-medium">{display(stop_loss)}</p>
              </div>
            </div>
          )}

          {explanation && (
            <p className="text-xs italic text-gray-600 dark:text-gray-400">
              📝 {explanation}
            </p>
          )}

          {ai_explanation && (
            <p className="text-xs italic text-purple-500 dark:text-purple-300">
              🤖 {ai_explanation}
            </p>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="
              text-sm text-purple-600 dark:text-purple-300 
              underline hover:text-purple-800
            "
          >
            🔁 Genereer strategie (AI)
          </button>

          <button
            disabled={loading}
            className="text-yellow-400 text-2xl hover:text-yellow-300"
          >
            {favorite ? '⭐' : '☆'}
          </button>
        </div>
      </div>
    </>
  );
}
