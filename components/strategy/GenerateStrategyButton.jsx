'use client';

import { useState } from 'react';
import { generateStrategy } from '@/lib/api/strategy';

export default function GenerateStrategyButton({ setupId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (!setupId) return;
    setLoading(true);
    setStatus('⏳ Strategie wordt gegenereerd...');

    try {
      const data = await generateStrategy(setupId, true); // 🔁 overwrite = true
      if (data?.task_id) {
        setStatus('✅ Strategie gegenereerd (AI gestart)');
        if (onSuccess) onSuccess(); // 🚀 callback voor herladen
      } else {
        setStatus('⚠️ Geen task ID ontvangen');
      }
    } catch (err) {
      console.error('❌ Fout bij strategie-generatie:', err);
      setStatus('❌ Fout bij genereren');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
      >
        🔁 Genereer Strategie (AI)
      </button>
      {status && <p className="text-xs text-gray-500">{status}</p>}
    </div>
  );
}
