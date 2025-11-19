'use client';

import { useState } from 'react';
import { generateStrategy, fetchTaskStatus, fetchStrategyBySetup } from '@/lib/api/strategy';

export default function GenerateStrategyButton({ setupId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // ======================================================
  // 🔁 Poll Celery Task (elke 1.5 seconden)
  // ======================================================
  async function waitForTask(taskId) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetchTaskStatus(taskId);

          console.log('📡 Polling task status:', res);

          if (!res || res?.state === 'FAILURE') {
            clearInterval(interval);
            reject('❌ Celery taak mislukt');
          }

          if (res?.state === 'SUCCESS' || res?.result?.success) {
            clearInterval(interval);
            resolve(res);
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, 1500);
    });
  }

  // ======================================================
  // 🚀 Strategie genereren
  // ======================================================
  const handleGenerate = async () => {
    if (!setupId) {
      setStatus('❌ Setup ID ontbreekt');
      return;
    }

    setLoading(true);
    setStatus('⏳ Strategie wordt gestart...');

    try {
      // Stap 1 — API call → Celery starten
      const data = await generateStrategy(setupId, true);

      if (!data?.task_id) {
        setStatus('❌ Ongeldige serverrespons');
        setLoading(false);
        return;
      }

      setStatus('🤖 AI is bezig met strategie genereren...');

      // Stap 2 — Wachten tot Celery klaar is
      const done = await waitForTask(data.task_id);

      setStatus('✨ Strategie gegenereerd!');

      // Stap 3 — Na succes: de nieuwe/bestaande strategy ophalen
      const finalStrategy = await fetchStrategyBySetup(setupId);

      if (onSuccess) onSuccess(finalStrategy?.strategy || null);

      // Status mooi laten vervagen
      setTimeout(() => setStatus(''), 2500);

    } catch (err) {
      console.error('❌ Strategie-generatie fout:', err);
      setStatus('❌ Er ging iets mis tijdens genereren');
    }

    setLoading(false);
  };

  // ======================================================
  // 🔘 Render
  // ======================================================
  return (
    <div className="space-y-2">

      {/* BUTTON */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="
          px-3 py-1 text-sm bg-indigo-600 text-white rounded
          hover:bg-indigo-700 transition
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2 shadow-sm
        "
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Even geduld...
          </>
        ) : (
          <>
            🔁 Genereer Strategie (AI)
          </>
        )}
      </button>

      {/* STATUS MESSAGE */}
      {status && (
        <p className="text-xs text-gray-700 animate-fade-slide">
          {status}
        </p>
      )}
    </div>
  );
}
