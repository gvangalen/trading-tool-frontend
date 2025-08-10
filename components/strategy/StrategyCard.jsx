'use client';

import { useState } from 'react';
import { updateStrategy, deleteStrategy } from '@/lib/api/strategy';
import { generateStrategyForSetup } from '@/lib/api/strategy';

export default function StrategyCard({ strategy, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState({ ...strategy });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!strategy) return null;

  const {
    id,
    setup_name,
    asset,
    timeframe,
    strategy_type,
    explanation,
    favorite,
  } = strategy;

  const lowerStrategyType = strategy_type?.toLowerCase() || '';

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      await updateStrategy(id, editFields);
      setEditing(false);
      onEdit && onEdit();
    } catch (err) {
      console.error('❌ Strategie opslaan mislukt:', err);
      setError('Opslaan mislukt. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Weet je zeker dat je deze strategie wilt verwijderen?')) {
      try {
        setLoading(true);
        await deleteStrategy(id);
        setEditing(false);
        onDelete && onDelete();
      } catch (err) {
        console.error('❌ Verwijderen mislukt:', err);
        setError('Verwijderen mislukt. Probeer het later opnieuw.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');
      await generateStrategyForSetup(strategy.setup_id, true);
      onEdit && onEdit();
    } catch (err) {
      console.error('❌ Generatie mislukt:', err);
      setError('Generatie mislukt. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const displayValue = (value) =>
    value !== null && value !== undefined && value !== '' ? value : '-';

  return (
    <div className="border p-4 rounded shadow bg-white dark:bg-gray-900 dark:text-white space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{setup_name || '🛠️ Onbekende setup'}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setError('');
              setEditing(!editing);
              setEditFields({ ...strategy });
            }}
            className="text-blue-500 text-sm"
            aria-label="Bewerken"
            title="Bewerken"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 text-sm"
            aria-label="Verwijderen"
            title="Verwijderen"
            disabled={loading}
          >
            🗑️
          </button>
        </div>
      </div>

      {!editing ? (
        <>
          <p className="text-sm text-gray-500">
            {lowerStrategyType.toUpperCase()} | {asset} {timeframe}
          </p>
          {lowerStrategyType !== 'dca' && (
            <div className="text-sm flex flex-col gap-1">
              <span title="Entry prijs">🎯 Entry: €{displayValue(strategy.entry)}</span>
              <span title="Target prijs">
                🎯 Target:{' '}
                {Array.isArray(strategy.targets) && strategy.targets.length > 0
                  ? strategy.targets[0]
                  : '-'}
              </span>
              <span title="Stop-loss">🛡️ SL: €{displayValue(strategy.stop_loss)}</span>
            </div>
          )}
          {explanation && (
            <p className="text-xs mt-2 italic text-gray-500">🧠 {explanation}</p>
          )}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </>
      ) : (
        <>
          {lowerStrategyType !== 'dca' && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              <input
                className="border px-2 py-1 rounded"
                placeholder="Entry"
                value={editFields.entry || ''}
                onChange={(e) =>
                  setEditFields({ ...editFields, entry: e.target.value })
                }
                aria-label="Entry prijs"
              />
              <input
                className="border px-2 py-1 rounded"
                placeholder="Target"
                value={
                  Array.isArray(editFields.targets) && editFields.targets.length > 0
                    ? editFields.targets[0]
                    : ''
                }
                onChange={(e) =>
                  setEditFields({ ...editFields, targets: [e.target.value] })
                }
                aria-label="Target prijs"
              />
              <input
                className="border px-2 py-1 rounded"
                placeholder="Stop-loss"
                value={editFields.stop_loss || ''}
                onChange={(e) =>
                  setEditFields({ ...editFields, stop_loss: e.target.value })
                }
                aria-label="Stop-loss prijs"
              />
            </div>
          )}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <button
            onClick={handleSave}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
            disabled={loading}
            aria-label="Opslaan"
          >
            💾 Opslaan
          </button>
        </>
      )}

      <div className="flex justify-end mt-2">
        <button
          onClick={handleGenerate}
          className="text-xs text-purple-500 underline"
          disabled={loading}
          aria-label="Genereer strategie via AI"
          title="Genereer strategie via AI"
        >
          🔁 Genereer strategie (AI)
        </button>
      </div>
    </div>
  );
}