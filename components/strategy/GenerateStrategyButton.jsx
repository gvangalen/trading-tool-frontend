'use client';

import { useState } from 'react';
import { generateStrategy } from '@/lib/api/strategy';

export default function GenerateStrategyButton({ setupId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (!setupId) {
      setStatus('❌ Setup ID ontbreekt');
      return;
    }

    setLoading(true);
    setStatus('⏳ Strategie wordt gegenereerd...');

    try {
      const data = await generateStrategy(setupId, true); // overwrite = true

      if (data && typeof data === 'object') {
        if (data?.task_id) {
          setStatus('✅ Strategie gegenereerd — AI taak gestart');
          if (onSuccess) onSuccess();
        } else if (data?.status === 'completed') {
          setStatus('✅ Strategie direct gegenereerd');
          if (onSuccess) onSuccess();
        } else {
          setStatus('⚠️ Geen geldige response ontvangen');
        }
      } else {
        setStatus('❌ Ongeldige respons van server');
      }
    } catch (err) {
      console.error('❌ Fout bij strategie-generatie:', err);
      setStatus('❌ Fout bij genereren');
    } finally {
      setLoading(false);

      // status automatisch laten wegfaden
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="space-y-2">

      {/* BUTTON */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Even geduld...
          </>
        ) : (
          <>🔁 Genereer Strategie (AI)</>
        )}
      </button>

      {/* STATUS MESSAGE */}
      {status && (
        <p className="text-xs text-gray-600 fade-in">
          {status}
        </p>
      )}
    </div>
  );
}
