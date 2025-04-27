'use client';

import { useAdviceData } from '@/hooks/useAdviceData';

export default function AdviceCard() {
  const { advice, loading, error } = useAdviceData();

  if (loading) {
    return (
      <div className="p-6 border rounded shadow bg-white dark:bg-gray-800">
        <p className="text-gray-500">📡 Tradingadvies laden...</p>
      </div>
    );
  }

  if (error || !advice) {
    return (
      <div className="p-6 border rounded shadow bg-white dark:bg-gray-800">
        <p className="text-red-500">❌ Fout bij ophalen tradingadvies.</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded shadow bg-white dark:bg-gray-800 space-y-4">
      <h2 className="text-xl font-bold">📋 Tradingadvies</h2>

      <div className="space-y-2 text-sm">
        <div><strong>🎯 Strategie:</strong> {advice.strategy || '-'}</div>
        <div><strong>🎯 Entry:</strong> {advice.entry || '-'}</div>
        <div><strong>🎯 Targets:</strong> {advice.targets || '-'}</div>
        <div><strong>🛑 Stop-Loss:</strong> {advice.stop_loss || '-'}</div>
        <div><strong>📈 Risico/Beloning:</strong> {advice.risk_reward || '-'}</div>
        <div><strong>🧠 Uitleg:</strong> {advice.explanation || '-'}</div>
      </div>
    </div>
  );
}
