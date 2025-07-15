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
  onGenerateAI,
  isEmpty = false,
}) {
  if (!strategy || isEmpty) {
    return (
      <CardWrapper className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
        <p className="text-lg">📭 Je hebt nog geen strategieën opgeslagen.</p>
        <p className="text-sm mt-1">Voeg onderaan je eerste strategie toe om te starten.</p>
      </CardWrapper>
    );
  }

  const data = isEditing ? editFields : strategy;

  const Tag = ({ label }) => (
    <span
      title={`Tag: ${label}`}
      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mr-1 mb-1"
    >
      {label}
    </span>
  );

  const Badge = ({ text, color, title }) => (
    <span
      className={`text-xs px-2 py-0.5 rounded font-medium ${color}`}
      title={title}
    >
      {text}
    </span>
  );

  const getScoreBadge = (score) => {
    if (score >= 80)
      return <Badge text={`Score: ${score}`} color="bg-green-100 text-green-800" title="Sterke strategie" />;
    if (score >= 50)
      return <Badge text={`Score: ${score}`} color="bg-yellow-100 text-yellow-800" title="Gemiddelde strategie" />;
    return <Badge text={`Score: ${score}`} color="bg-red-100 text-red-800" title="Zwakke strategie" />;
  };

  const handleChange = (field, value) => {
    onFieldChange(field, value);
  };

  return (
    <CardWrapper className="bg-white p-4 rounded-xl shadow space-y-3 border border-gray-200">
      {/* 🧠 Titel + favoriet */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          🧠 {data.setup_name || 'Strategie'}
        </h3>
        <button onClick={() => onFavoriteToggle(strategy.id, strategy.favorite)} title="Markeer als favoriet">
          {strategy.favorite ? '⭐️' : '☆'}
        </button>
      </div>

      {/* 📊 Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {typeof data.score === 'number' && getScoreBadge(data.score)}
        {data.strategy_type && (
          <Badge text={data.strategy_type} color="bg-purple-100 text-purple-800" title="Strategietype" />
        )}
        {data.account_type && (
          <Badge text={data.account_type} color="bg-orange-100 text-orange-800" title="Accounttype" />
        )}
      </div>

      {/* 📋 Inhoud */}
      {!isEditing ? (
        <div className="text-sm text-gray-700 space-y-1 mt-2">
          <div className="flex flex-wrap items-center gap-3">
            {data.asset && <span title="Asset">🪙 <strong>{data.asset}</strong></span>}
            {data.timeframe && <span title="Timeframe">⏱️ {data.timeframe}</span>}
            <span title="Entry prijs">🎯 Entry: €{data.entry || '-'}</span>
            <span title="Target prijs">🎯 Target: €{data.targets?.[0] || '-'}</span>
            <span title="Stop-loss">🛡️ SL: €{data.stop_loss || '-'}</span>
          </div>

          {data.tags && (
            <div className="mt-2 flex flex-wrap">
              {data.tags.split(',').map((tag) => (
                <Tag key={tag.trim()} label={tag.trim()} />
              ))}
            </div>
          )}

          <div className="mt-2 text-gray-600 whitespace-pre-line">
            {data.explanation || 'ℹ️ Geen uitleg beschikbaar.'}
          </div>
        </div>
      ) : (
        <div className="space-y-2 mt-2">
          <input
            className="border p-1 rounded w-full"
            placeholder="Entry prijs (€)"
            value={editFields.entry || ''}
            onChange={(e) => handleChange('entry', e.target.value)}
          />
          <input
            className="border p-1 rounded w-full"
            placeholder="Target prijs (€)"
            value={editFields.targets?.[0] || ''}
            onChange={(e) => handleChange('targets', [e.target.value])}
          />
          <input
            className="border p-1 rounded w-full"
            placeholder="Stop-loss (€)"
            value={editFields.stop_loss || ''}
            onChange={(e) => handleChange('stop_loss', e.target.value)}
          />
          <textarea
            className="border p-1 rounded w-full"
            placeholder="Uitleg"
            value={editFields.explanation || ''}
            onChange={(e) => handleChange('explanation', e.target.value)}
          />
        </div>
      )}

      {/* 🧠 AI uitleg */}
      <div>
        <button
          onClick={() => onGenerateAI(strategy.setup_id)}
          className="text-blue-600 text-sm hover:underline"
          disabled={isLoading}
          title="Laat AI automatisch een strategie genereren op basis van deze setup"
        >
          🔁 Genereer Strategie (AI)
        </button>
      </div>

      {/* 🛠️ Actieknoppen */}
      <div className="flex gap-3 text-sm mt-2">
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
