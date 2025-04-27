'use client';

import { useState } from 'react';
import { useStrategyData } from '@/hooks/useStrategyData';

export default function StrategyList() {
  const { strategies, loadStrategies, updateStrategy, deleteStrategy } = useStrategyData();
  const [sort, setSort] = useState('created_at');
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState('');

  const sortedStrategies = [...strategies].sort((a, b) => {
    if (sort === 'score') return (b.score || 0) - (a.score || 0);
    if (sort === 'favorite') return (b.favorite === true) - (a.favorite === true);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleEditToggle = (strategy) => {
    setEditingId(strategy.id);
    setEditFields({ ...strategy });
  };

  const handleFieldChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFields({});
  };

  const handleSave = async () => {
    if (!editingId) return;
    const original = strategies.find((s) => s.id === editingId);
    const changes = {};

    for (const key in editFields) {
      if (editFields[key] !== original[key]) {
        changes[key] = editFields[key];
      }
    }

    if (Object.keys(changes).length > 0) {
      try {
        setLoadingId(editingId);
        await updateStrategy(editingId, changes);
        await loadStrategies();
        showToast('✅ Strategy saved!');
      } catch (err) {
        showToast('❌ Save failed');
      } finally {
        setLoadingId(null);
      }
    }

    setEditingId(null);
    setEditFields({});
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this strategy?')) {
      try {
        setLoadingId(id);
        await deleteStrategy(id);
        await loadStrategies();
        showToast('🗑️ Strategy deleted!');
      } catch (err) {
        showToast('❌ Delete failed');
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleFavoriteToggle = async (id, currentFavorite) => {
    await updateStrategy(id, { favorite: !currentFavorite });
    await loadStrategies();
    showToast(currentFavorite ? '⭐️ Removed from favorites' : '⭐️ Added to favorites');
  };

  return (
    <div className="relative space-y-6">
      <div className="flex justify-end mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="created_at">Latest</option>
          <option value="score">Score</option>
          <option value="favorite">Favorite</option>
        </select>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}

      {sortedStrategies.map((s) => {
        const isEditing = editingId === s.id;
        const isLoading = loadingId === s.id;
        const data = isEditing ? editFields : s;

        return (
          <div key={s.id} className="p-4 border rounded shadow bg-white dark:bg-gray-800 space-y-2">
            <div className="flex justify-between items-center">
              {isEditing ? (
                <input
                  value={data.setup_name || ''}
                  onChange={(e) => handleFieldChange('setup_name', e.target.value)}
                  className="border p-1 rounded w-2/3"
                />
              ) : (
                <strong>{s.setup_name || 'Strategy'}</strong>
              )}
              <button onClick={() => handleFavoriteToggle(s.id, s.favorite)}>
                {s.favorite ? '⭐️' : '☆'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Asset/TF:</strong>{' '}
                {isEditing ? (
                  <input
                    value={data.asset || ''}
                    onChange={(e) => handleFieldChange('asset', e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  `${s.asset} (${s.timeframe})`
                )}
              </div>
              <div>
                <strong>Score:</strong>{' '}
                {isEditing ? (
                  <input
                    value={data.score ?? ''}
                    onChange={(e) => handleFieldChange('score', e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  s.score ?? '-'
                )}
              </div>
              <div>
                <strong>Entry:</strong>{' '}
                {isEditing ? (
                  <input
                    value={data.entry ?? ''}
                    onChange={(e) => handleFieldChange('entry', e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  s.entry ?? '-'
                )}
              </div>
              <div>
                <strong>Stop-loss:</strong>{' '}
                {isEditing ? (
                  <input
                    value={data.stop_loss ?? ''}
                    onChange={(e) => handleFieldChange('stop_loss', e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  s.stop_loss ?? '-'
                )}
              </div>
              <div className="col-span-2">
                <strong>Targets:</strong>{' '}
                {isEditing ? (
                  <input
                    value={(data.targets || []).join(', ')}
                    onChange={(e) => handleFieldChange('targets', e.target.value.split(',').map((v) => v.trim()))}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  (s.targets || []).join(', ') || '-'
                )}
              </div>
              <div>
                <strong>Risk/Reward:</strong>{' '}
                {isEditing ? (
                  <input
                    value={data.risk_reward ?? ''}
                    onChange={(e) => handleFieldChange('risk_reward', e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  s.risk_reward ?? '-'
                )}
              </div>
            </div>

            <div className="mt-2">
              <strong>Explanation:</strong>
              {isEditing ? (
                <textarea
                  value={data.explanation || ''}
                  onChange={(e) => handleFieldChange('explanation', e.target.value)}
                  className="border p-1 rounded w-full mt-1"
                  rows={3}
                />
              ) : (
                <div className="mt-1 text-gray-700 dark:text-gray-300 text-sm italic">
                  {s.explanation || 'No explanation provided.'}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {isLoading ? '💾 Saving...' : '💾 Save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    ✖️ Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditToggle(s)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    {isLoading ? '🗑️ Deleting...' : '🗑️ Delete'}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
