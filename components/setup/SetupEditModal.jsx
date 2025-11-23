"use client";

import { useEffect } from "react";
import SetupForm from "@/components/setup/SetupForm";
import { X, XCircle, Save } from "lucide-react";

export default function SetupEditModal({ open, onClose, setup, reload }) {
  // Sluit met ESC
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!open || !setup) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/40 backdrop-blur-sm
        flex items-center justify-center
        p-4
      "
    >
      <div
        className="
          bg-[var(--card-bg)]
          border border-[var(--card-border)]
          rounded-3xl shadow-2xl
          w-full max-w-xl
          max-h-[85vh] overflow-y-auto
          relative p-6 animate-fade-slide
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 
            text-[var(--text-light)]
            hover:text-[var(--text-dark)]
            transition
          "
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-4 flex items-center gap-2">
          <Save size={18} className="text-[var(--primary)]" />
          Setup bewerken
        </h2>

        {/* FORM */}
        <SetupForm
          mode="edit"
          initialData={setup}
          onSaved={() => {
            reload();
            onClose();
          }}
        />

        {/* Footer */}
        <div
          className="
            flex justify-between items-center gap-4
            mt-8 pt-5
            border-t border-[var(--border)]
          "
        >
          {/* Cancel */}
          <button
            onClick={onClose}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-xl
              bg-[var(--bg-soft)]
              border border-[var(--border)]
              text-[var(--text-dark)]
              hover:bg-white hover:shadow
              transition
            "
          >
            <XCircle size={16} />
            Annuleren
          </button>

          {/* Save */}
          <button
            onClick={() =>
              document.querySelector("#setup-edit-submit")?.click()
            }
            className="
              flex items-center gap-2
              px-5 py-2 rounded-xl
              bg-[var(--primary)]
              hover:bg-[var(--primary-dark)]
              text-white font-semibold
              shadow-sm hover:shadow-md
              transition
            "
          >
            <Save size={16} />
            Update opslaan
          </button>
        </div>
      </div>
    </div>
  );
}
