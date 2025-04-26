'use client';
import { useStrategyData } from '@/hooks/useStrategyData';
import { useEffect, useState } from 'react';

export default function StrategyList() {
  const { strategies, loadStrategies, updateStrategy, deleteStrategy, generateStrategy } = useStrategyData();
  const [sort, setSort] = useState('created_at');

  useEffect(() => {
    loadStrategies();
  }, []);

  const sortedStrategies = [...strategies].sort((a, b) => {
    if (sort === 'score') return (b.score || 0) - (a.score || 0);
    if (sort === 'favorite') return (b.favorite === true) - (a.favorite === true);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="space-y-4">
      {sortedStrategies.map((s) => (
        <div key={s.id} className="p-4 border rounded shadow bg-white dark:bg-gray-800">
          <div className="flex justify-between">
            <strong>{s.setup_name || 'Strategy'}</strong>
            <span>{s.favorite ? '⭐️' : '☆'}</span>
          </div>
          {/* Fill in further: TF, Score, Entry, Targets, Stoploss, Explanation */}
        </div>
      ))}
    </div>
  );
}
