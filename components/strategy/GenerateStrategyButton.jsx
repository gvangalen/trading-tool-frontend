"use client";

import { useState } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  analyzeStrategy,      // POST /api/strategies/analyze
  fetchTaskStatus,
} from "@/lib/api/strategy";

/* Icons */
import { Wand2, Loader2 } from "lucide-react";

export default function AnalyzeStrategyButton({ onSuccess }) {
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

          if (!res) return;

          if (res.state === "FAILURE") {
            clearInterval(interval);
            reject(new Error("AI analyse mislukt"));
          }

          if (res.state === "SUCCESS") {
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
  // 🧠 START STRATEGY ANALYSE (USER-LEVEL)
  // ======================================================
  const handleAnalyze = async () => {
    setLoading(true);
    setStatus("🧠 AI analyseert je strategieën...");

    try {
      // 1️⃣ Start AI analyse
      const res = await analyzeStrategy();

      if (!res?.task_id) {
        throw new Error("Geen task_id ontvangen");
      }

      // 2️⃣ Wacht tot Celery klaar is
      await waitForTask(res.task_id);

      showSnackbar("🧠 AI-strategieanalyse bijgewerkt", "success");
      setStatus("");

      // 3️⃣ Parent laten refreshen (optioneel)
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("❌ AI analyse fout:", err);
      showSnackbar("AI analyse mislukt", "danger");
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
        onClick={handleAnalyze}
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
            AI bezig…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Analyseer strategieën (AI)
          </>
        )}
      </button>

      {status && (
        <p className="text-xs text-gray-700 dark:text-gray-300">
          {status}
        </p>
      )}
    </div>
  );
}
