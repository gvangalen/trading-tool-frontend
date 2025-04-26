'use client';

import { useState } from 'react';
import { useStrategyData } from '@/hooks/useStrategyData';

export default function StrategyList() {
  const { strategies, loadStrategies, updateStrategy, deleteStrategy } = useStrategyData();
  const [sort, setSort] = useState('created_at');

  const sortedStrategies = [...strategies].sort((a, b) => {
    if (sort === 'score') return (b.score || 0) - (a.score || 0);
    if (sort === 'favorite') return (b.favorite === true) - (a.favorite === true);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleFavoriteToggle = async (id, currentFavorite) => {
    await updateStrategy(id, { favorite: !currentFavorite });
    await loadStrategies();
  };

  const handleSave = async (id, fields) => {
    await updateStrategy(id, fields);
    await loadStrategies();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this strategy?')) {
      await deleteStrategy(id);
      await loadStrategies();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
          <option value="created_at">Latest</option>
          <option value="score">Score</option>
          <option value="favorite">Favorite</option>
        </select>
      </div>

      {sortedStrategies.map((s) => (
        <div key={s.id} className="p-4 border rounded shadow bg-white dark:bg-gray-800 space-y-2">
          <div className="flex justify-between items-center">
            <strong>{s.setup_name || 'Strategy'}</strong>
            <button onClick={() => handleFavoriteToggle(s.id, s.favorite)}>
              {s.favorite ? '⭐️' : '☆'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Asset/TF:</strong> {s.asset} ({s.timeframe})</div>
            <div><strong>Score:</strong> {s.score ?? '-'}</div>
            <div><strong>Entry:</strong> {s.entry ?? '-'}</div>
            <div><strong>Stop-loss:</strong> {s.stop_loss ?? '-'}</div>
            <div><strong>Targets:</strong> {(s.targets || []).join(', ') || '-'}</div>
            <div><strong>Risk/Reward:</strong> {s.risk_reward ?? '-'}</div>
          </div>

          <div className="mt-2">
            <strong>Explanation:</strong>
            <div className="mt-1 text-gray-700 dark:text-gray-300 text-sm italic">
              {s.explanation || 'No explanation provided.'}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => handleSave(s.id, { ...s })}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              💾 Save
            </button>
            <button
              onClick={() => handleDelete(s.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
