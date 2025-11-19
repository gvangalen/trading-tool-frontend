'use client';

import { useState } from 'react';
import { generateStrategy, getTaskStatus } from '@/lib/api/strategy';

export default function GenerateStrategyButton({ setupId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Poll Celery elke 1.5 sec
  async function waitForTask(taskId) {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const res = await getTaskStatus(taskId);

        if (res?.state === 'SUCCESS' || res?.result?.success) {
          clearInterval(interval);
          resolve(res);
        }
      }, 1500);
    });
  }

  const handleGenerate = async () => {
    if (!setupId) {
      setStatus('❌ Setup ID ontbreekt');
      return;
    }

    setLoading(true);
    setStatus('⏳ Strategie wordt gegenereerd...');

    try {
      // Stap 1 – call API (start Celery)
      const data = await generateStrategy(setupId, true);

      if (!data?.task_id) {
        setStatus('❌ Foute server-respons');
        setLoading(false);
        return;
      }

      setStatus('🤖 AI is strategie aan het maken...');

      // Stap 2 – wachten tot Celery klaar is
      const done = await waitForTask(data.task_id);

      setStatus('✅ Strategie klaar!');

      if (onSuccess) onSuccess(done?.result?.strategy);

      setTimeout(() => setStatus(''), 2000);

    } catch (err) {
      console.error(err);
      setStatus('❌ Fout bij genereren');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Even wachten...
          </>
        ) : (
          <>🔁 Genereer Strategie (AI)</>
        )}
      </button>

      {status && (
        <p className="text-xs text-gray-600 fade-in">
          {status}
        </p>
      )}
    </div>
  );
}
