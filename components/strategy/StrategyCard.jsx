'use client';

import { useState, useEffect } from 'react';
import { updateStrategy, deleteStrategy } from '@/lib/api/strategy';
import { generateStrategyForSetup } from '@/lib/api/strategy';

export default function StrategyCard({ strategy, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState({ ...strategy });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync editFields met strategy als die verandert
  useEffect(() => {
    setEditFields({ ...strategy });
  }, [strategy]);

  if (!strategy) return null;

  const {
    id,
    setup_name,
    symbol,
    timeframe,
    strategy_type,
    explanation,
    favorite,
    entry,
    targets,
    stop_loss,
  } = strategy;

  const lowerStrategyType = strategy_type?.toLowerCase() || '';

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      // Cast numerieke velden correct
      const payload = {
        ...editFields,
        entry: editFields.entry ? Number(editFields.entry) : null,
        stop_loss: editFields.stop_loss ? Number(editFields.stop_loss) : null,
        targets: Array.isArray(editFields.targets)
          ? editFields.targets.map((t) => Number(t))
          : [],
      };
      await updateStrategy(id, payload);
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
    <div className="border rounded-lg shadow-md bg-white dark:bg-gray-900 dark:text-white p-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg truncate">{setup_name || '🛠️ Onbekende setup'}</h3>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setError('');
                setEditing(!editing);
              }}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
              aria-label="Bewerken"
              title="Bewerken"
              disabled={loading}
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 focus:outline-none"
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="uppercase font-medium">{lowerStrategyType}</span> | {symbol} {timeframe}
            </p>
            {lowerStrategyType !== 'dca' && (
              <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300 mb-2">
                <p title="Entry prijs">🎯 Entry: €{displayValue(entry)}</p>
                <p title="Target prijs">
                  🎯 Target: {Array.isArray(targets) && targets.length > 0 ? targets[0] : '-'}
                </p>
                <p title="Stop-loss">🛡️ SL: €{displayValue(stop_loss)}</p>
              </div>
            )}
            {explanation && (
              <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">🧠 {explanation}</p>
            )}
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          </>
        ) : (
          <>
            {lowerStrategyType !== 'dca' && (
              <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                <input
                  className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
                  placeholder="Entry"
                  value={editFields.entry ?? ''}
                  onChange={(e) =>
                    setEditFields({ ...editFields, entry: e.target.value })
                  }
                  aria-label="Entry prijs"
                  type="number"
                  step="0.01"
                />
                <input
                  className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
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
                  type="number"
                  step="0.01"
                />
                <input
                  className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
                  placeholder="Stop-loss"
                  value={editFields.stop_loss ?? ''}
                  onChange={(e) =>
                    setEditFields({ ...editFields, stop_loss: e.target.value })
                  }
                  aria-label="Stop-loss prijs"
                  type="number"
                  step="0.01"
                />
              </div>
            )}
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <button
              onClick={handleSave}
              className="w-full mt-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold disabled:bg-blue-300"
              disabled={loading}
              aria-label="Opslaan"
            >
              💾 Opslaan
            </button>
          </>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleGenerate}
          className="text-sm text-purple-600 underline hover:text-purple-800 focus:outline-none"
          disabled={loading}
          aria-label="Genereer strategie via AI"
          title="Genereer strategie via AI"
        >
          🔁 Genereer strategie (AI)
        </button>

        <div className="text-yellow-500 text-xl select-none" title={favorite ? 'Favoriet' : 'Niet favoriet'}>
          {favorite ? '⭐' : '☆'}
        </div>
      </div>
    </div>
  );
}
