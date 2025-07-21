'use client';

import { useState } from 'react';
import { generateAllStrategies } from '@/lib/api/strategy'; // ✅ Correcte import

export default function StrategyGenerator() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setStatus('⏳ Strategieën worden gegenereerd...');

    try {
      const data = await generateAllStrategies();
      console.log('⚙️ Response van backend:', data);

      if (data?.task_id) {
        setStatus(`✅ AI-strategiegeneratie gestart (Task ID: ${data.task_id})`);
      } else if (data?.status === 'completed') {
        setStatus('✅ Strategieën succesvol gegenereerd (zonder Celery)');
      } else if (Array.isArray(data)) {
        setStatus(`✅ ${data.length} strategieën gegenereerd zonder Celery`);
      } else {
        setStatus('⚠️ Fout: onbekend antwoord van backend');
      }
    } catch (err) {
      console.error('❌ Fout bij AI-strategiegeneratie:', err);
      setStatus('❌ Fout bij starten AI-strategiegeneratie');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        🔁 Genereer Strategieën (AI)
      </button>
      {status && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>
      )}
    </div>
  );
}
