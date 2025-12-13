"use client";

import { useState } from "react";

import {
  generateStrategy,
  fetchTaskStatus,
  fetchStrategyBySetup,
} from "@/lib/api/strategy";

import { useModal } from "@/components/ui/ModalProvider";

/* Lucide icons */
import { Wand2, Loader2 } from "lucide-react";

export default function GenerateStrategyButton({ setupId, onSuccess }) {
  const { showSnackbar } = useModal();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // ======================================================
  // 🔁 Poll Celery Task
  // ======================================================
  async function waitForTask(taskId) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetchTaskStatus(taskId);

          if (!res || res?.state === "FAILURE") {
            clearInterval(interval);
            reject("Celery taak mislukt");
          }

          if (res?.state === "SUCCESS" || res?.result?.success) {
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
  // 🚀 AI Strategie genereren
  // ======================================================
  const handleGenerate = async () => {
    if (!setupId) {
      showSnackbar("Setup ontbreekt", "danger");
      return;
    }

    setLoading(true);
    setStatus("🤖 AI is bezig met genereren...");

    try {
      const data = await generateStrategy(setupId, true);

      if (!data?.task_id) {
        throw new Error("Ongeldige serverrespons");
      }

      await waitForTask(data.task_id);

      const final = await fetchStrategyBySetup(setupId);

      if (onSuccess) onSuccess(final?.strategy || null);

      showSnackbar("Strategie succesvol gegenereerd", "success");
      setStatus("");

    } catch (err) {
      console.error("❌ Strategie-generatie fout:", err);
      showSnackbar("Strategie genereren mislukt", "danger");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // 🔘 UI
  // ======================================================
  return (
    <div className="space-y-2">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="
          flex items-center gap-2
          px-4 py-2 text-sm font-medium
          rounded-xl shadow-md
          text-white bg-[var(--primary)]
          hover:bg-blue-700
          transition
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Bezig…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Genereer Strategie (AI)
          </>
        )}
      </button>

      {status && (
        <p className="text-xs text-gray-700 dark:text-gray-300 animate-fade-slide">
          {status}
        </p>
      )}
    </div>
  );
}
