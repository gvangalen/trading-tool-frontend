'use client';

import React from 'react';
import CardWrapper from '@/components/ui/CardWrapper';

export default function StrategyCard({
  strategy,
  isEditing,
  isLoading,
  editFields,
  onFieldChange,
  onEditToggle,
  onCancelEdit,
  onSave,
  onDelete,
  onFavoriteToggle,
  onGenerateAI
}) {
  const data = isEditing ? editFields : strategy;

  return (
    <CardWrapper>
      {/* 🔹 Titel en favoriet */}
      <div className="flex justify-between items-center mb-2">
        {isEditing ? (
          <input
            value={data.setup_name || ''}
            onChange={(e) => onFieldChange('setup_name', e.target.value)}
            className="border p-1 rounded w-2/3"
          />
        ) : (
          <strong>{data.setup_name || 'Strategy'}</strong>
        )}
        <button onClick={() => onFavoriteToggle(strategy.id, strategy.favorite)}>
          {strategy.favorite ? '⭐️' : '☆'}
        </button>
      </div>

      {/* 🔁 AI Genereer knop */}
      <button
        onClick={() => onGenerateAI(strategy.setup_id)}
        className="text-blue-600 text-sm hover:underline"
        disabled={isLoading}
      >
        🔁 Genereer Strategie (AI)
      </button>

      {/* ✏️ Bewerken / Verwijderen */}
      <div className="flex gap-2 mt-2">
        {isEditing ? (
          <>
            <button onClick={onSave} className="text-green-600">💾 Opslaan</button>
            <button onClick={onCancelEdit} className="text-gray-500">Annuleren</button>
          </>
        ) : (
          <>
            <button onClick={() => onEditToggle(strategy)} className="text-blue-600">✏️ Bewerken</button>
            <button onClick={() => onDelete(strategy.id)} className="text-red-600">🗑️ Verwijderen</button>
          </>
        )}
      </div>
    </CardWrapper>
  );
}
