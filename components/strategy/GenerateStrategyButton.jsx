"use client";

import { useState } from "react";

import {
  generateStrategy,     // ➜ start AI analyse
  fetchTaskStatus,
} from "@/lib/api/strategy";

import { useModal } from "@/components/modal/ModalProvider";

/* Icons */
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
            reject("AI analyse mislukt");
          }

          if (res?.state === "SUCCESS") {
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
  // 🧠 AI ANALYSE STARTEN (GEEN STRATEGY INSERT)
  // ======================================================
  const handleGenerate = async () => {
    if (!setupId) {
      showSnackbar("Setup ontbreekt", "danger");
      return;
    }

    setLoading(true);
    setStatus("🧠 AI analyseert je strategie...");

    try {
      // 1️⃣ Start AI analyse
      const data = await generateStrategy(setupId);

      if (!data?.task_id) {
        throw new Error("Geen task_id ontvangen");
      }

      // 2️⃣ Wacht tot klaar
      await waitForTask(data.task_id);

      // 3️⃣ Klaar — analyse staat nu in DB
      showSnackbar("🧠 AI-advies bijgewerkt", "success");

      if (onSuccess) {
        onSuccess(); // optioneel: bijv. UI refresh trigger
      }

      setStatus("");

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
            AI bezig…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Analyseer Strategie (AI)
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
