'use client';

import { useState } from 'react';
import { useStrategyData } from '@/hooks/useStrategyData';
import CardWrapper from '@/components/ui/CardWrapper'; // ✅ toevoegen

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
      {/* 🔘 Sorteeropties */}
      <div className="flex justify-end mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="created_at">📅 Laatste</option>
          <option value="score">📈 Score</option>
          <option value="favorite">⭐ Favoriet</option>
        </select>
      </div>

      {/* 🔔 Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* 🧠 Strategiekaarten */}
      {sortedStrategies.map((s) => {
        const isEditing = editingId === s.id;
        const isLoading = loadingId === s.id;
        const data = isEditing ? editFields : s;

        return (
          <CardWrapper key={s.id}>
            {/* alles binnenin blijft hetzelfde */}
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

            {/* overige velden en knoppen zoals je ze al had */}
            {/* ... */}
          </CardWrapper>
        );
      })}
    </div>
  );
}
