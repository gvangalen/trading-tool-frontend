'use client';

import { useState, useEffect } from 'react';
import {
  updateStrategy,
  deleteStrategy,
  generateStrategy,
  fetchStrategyBySetup,
} from '@/lib/api/strategy';

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

  // ------------------------------
  // SAVE STRATEGY
  // ------------------------------
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      const payload = {
        ...fields,
        targets:
          Array.isArray(fields.targets) && fields.targets.length > 0
            ? fields.targets
            : [],
      };

      await updateStrategy(id, payload);

      setEditing(false);
      setJustUpdated(true);
      onUpdated && onUpdated();

      setTimeout(() => setJustUpdated(false), 2000);
    } catch (err) {
      console.error('❌ Update fout:', err);
      setError(err?.message || 'Opslaan mislukt');
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // DELETE
  // ------------------------------
  const handleDelete = async () => {
    if (!confirm('Weet je zeker dat je deze strategie wilt verwijderen?')) return;

    try {
      setLoading(true);
      await deleteStrategy(id);
      onUpdated && onUpdated();
    } catch (err) {
      console.error('❌ Delete fout:', err);
      setError('Verwijderen mislukt');
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // GENERATE (AI)
  // ------------------------------
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await generateStrategy(setup_id, true); // overwrite=true

      if (!res?.task_id) {
        setError('❌ Ongeldige respons');
        return;
      }

      // Poll until done
      let ready = false;
      while (!ready) {
        await new Promise((r) => setTimeout(r, 1500));
        const status = await fetchTaskStatus(res.task_id);
        if (status?.state === 'SUCCESS') ready = true;
      }

      // fetch final strategy
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
          {/* EDIT */}
          <button
            disabled={loading}
            onClick={() => setEditing(!editing)}
            className="text-blue-600 hover:text-blue-800"
          >
            ✏️
          </button>

          {/* DELETE */}
          <button
            disabled={loading}
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* TYPE / SYMBOL / TF */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span className="uppercase font-medium">{strategy_type}</span> | {symbol} {timeframe}
      </p>

      {/* ------------------------------
          VIEW MODE
      ------------------------------ */}
      {!editing ? (
        <>
          {!isDCA && (
            <div className="text-sm space-y-1 mb-2">
              <p>🎯 Entry: {display(entry)}</p>
              <p>🎯 Targets: {Array.isArray(targets) ? targets.join(', ') : '-'}</p>
              <p>🛡️ Stop-loss: {display(stop_loss)}</p>
            </div>
          )}

          {explanation && (
            <p className="text-xs text-gray-500 italic py-1">
              📝 {explanation}
            </p>
          )}

          {ai_explanation && (
            <p className="text-xs text-purple-500 italic py-1">
              🤖 {ai_explanation}
            </p>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </>
      ) : (
        <>
          {!isDCA && (
            <div className="grid grid-cols-3 gap-3 mb-2">
              <input
                className="border rounded px-2 py-1"
                placeholder="Entry"
                value={fields.entry || ''}
                onChange={(e) =>
                  setFields({ ...fields, entry: e.target.value })
                }
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="Targets (comma)"
                value={Array.isArray(fields.targets) ? fields.targets.join(',') : ''}
                onChange={(e) =>
                  setFields({ ...fields, targets: e.target.value.split(',') })
                }
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="Stop-loss"
                value={fields.stop_loss || ''}
                onChange={(e) =>
                  setFields({ ...fields, stop_loss: e.target.value })
                }
              />
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            💾 Opslaan
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </>
      )}

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
  );
}
