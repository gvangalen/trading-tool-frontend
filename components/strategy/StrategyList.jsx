'use client';

import { useState, useEffect } from 'react';
import { useStrategyData } from '@/hooks/useStrategyData';
import { generateStrategyForSetup } from '@/lib/api/strategy';
import StrategyCard from '@/components/strategy/StrategyCard';

export default function StrategyList({ searchTerm = '' }) {
  const { strategies, loadStrategies, updateStrategy, deleteStrategy } = useStrategyData();
  const [sort, setSort] = useState('created_at');
  const [filters, setFilters] = useState({ asset: '', timeframe: '', tag: '' });
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadStrategies();
  }, []);

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
        showToast('✅ Strategie opgeslagen!');
      } catch (err) {
        showToast('❌ Opslaan mislukt');
      } finally {
        setLoadingId(null);
      }
    }

    setEditingId(null);
    setEditFields({});
  };

  const handleDelete = async (id) => {
    if (confirm('Weet je zeker dat je deze strategie wilt verwijderen?')) {
      try {
        setLoadingId(id);
        await deleteStrategy(id);
        await loadStrategies();
        showToast('🗑️ Strategie verwijderd!');
      } catch (err) {
        showToast('❌ Verwijderen mislukt');
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleFavoriteToggle = async (id, currentFavorite) => {
    await updateStrategy(id, { favorite: !currentFavorite });
    await loadStrategies();
    showToast(currentFavorite ? '⭐️ Verwijderd uit favorieten' : '⭐️ Toegevoegd aan favorieten');
  };

  const handleGenerateAI = async (setupId) => {
    const overwrite = confirm(
      '🔁 Wil je de bestaande strategie overschrijven?\n\nKlik OK om te overschrijven, of Annuleer om een nieuwe toe te voegen.'
    );

    try {
      setLoadingId(setupId);
      const response = await generateStrategyForSetup(setupId, overwrite);
      await loadStrategies();

      if (response?.task_id) {
        showToast(`✅ Celery gestart (Task ID: ${response.task_id})`);
      } else if (response?.status === 'completed') {
        showToast(overwrite ? '♻️ Strategie overschreven' : '➕ Strategie toegevoegd');
      } else if (Array.isArray(response)) {
        showToast(`✅ ${response.length} strategieën gegenereerd`);
      } else {
        showToast('✅ Strategie gegenereerd');
      }
    } catch (err) {
      console.error('AI-generatie fout:', err);
      showToast('❌ AI-generatie mislukt');
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = strategies.filter((s) => {
    const matchesAsset = !filters.asset || s.asset === filters.asset;
    const matchesTimeframe = !filters.timeframe || s.timeframe === filters.timeframe;
    const matchesTag = !filters.tag || (s.tags || '').includes(filters.tag);
    const matchesSearch =
      !searchTerm ||
      (s.asset || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.tags || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAsset && matchesTimeframe && matchesTag && matchesSearch;
  });

  const sortedStrategies = [...filtered].sort((a, b) => {
    if (sort === 'score') return (b.score || 0) - (a.score || 0);
    if (sort === 'favorite') return (b.favorite === true) - (a.favorite === true);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-6">
      {/* 🔹 Filters & Sortering */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2">
          <select onChange={(e) => setFilters({ ...filters, asset: e.target.value })} className="border p-2 rounded">
            <option value="">Asset</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
          <select onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })} className="border p-2 rounded">
            <option value="">Timeframe</option>
            <option value="1D">1D</option>
            <option value="4H">4H</option>
          </select>
          <select onChange={(e) => setFilters({ ...filters, tag: e.target.value })} className="border p-2 rounded">
            <option value="">Tag</option>
            <option value="breakout">Breakout</option>
            <option value="retracement">Retracement</option>
          </select>
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
          <option value="created_at">📅 Laatste</option>
          <option value="score">📈 Score</option>
          <option value="favorite">⭐ Favoriet</option>
        </select>
      </div>

      {/* 🔹 Strategiekaarten */}
      {strategies.length === 0 ? (
        <StrategyCard isEmpty={true} />
      ) : sortedStrategies.length === 0 ? (
        <div className="text-center text-gray-500 pt-6">
          📭 Geen strategieën gevonden voor deze filters of zoekterm.
        </div>
      ) : (
        sortedStrategies.map((s) => (
          <StrategyCard
            key={s.id}
            strategy={editingId === s.id ? editFields : s}
            isEditing={editingId === s.id}
            isLoading={loadingId === s.id}
            onEditToggle={() => handleEditToggle(s)}
            onFieldChange={handleFieldChange}
            onCancelEdit={handleCancelEdit}
            onSave={handleSave}
            onDelete={() => handleDelete(s.id)}
            onGenerateAI={() => handleGenerateAI(s.setup_id)}
            onFavoriteToggle={() => handleFavoriteToggle(s.id, s.favorite)}
          />
        ))
      )}

      {/* 🔹 Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
