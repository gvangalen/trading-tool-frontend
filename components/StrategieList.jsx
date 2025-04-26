'use client';
import { useStrategieData } from '@/hooks/useStrategieData';
import { useEffect, useState } from 'react';

export default function StrategieLijst() {
  const { strategieën, loadStrategieën, updateStrategie, deleteStrategie, generateStrategie } = useStrategieData();
  const [sort, setSort] = useState('created_at');

  useEffect(() => {
    loadStrategieën();
  }, []);

  const sortedStrategieën = [...strategieën].sort((a, b) => {
    if (sort === 'score') return (b.score || 0) - (a.score || 0);
    if (sort === 'favoriet') return (b.favorite === true) - (a.favorite === true);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="space-y-4">
      {sortedStrategieën.map((s) => (
        <div key={s.id} className="p-4 border rounded shadow bg-white dark:bg-gray-800">
          <div className="flex justify-between">
            <strong>{s.setup_name || 'Strategie'}</strong>
            <span>{s.favorite ? '⭐️' : '☆'}</span>
          </div>
          {/* Vul hier verder in: TF, Score, Entry, Targets, Stoploss, Uitleg */}
        </div>
      ))}
    </div>
  );
}
