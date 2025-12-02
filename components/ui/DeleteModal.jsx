"use client";

import { Trash2, X } from "lucide-react";

export default function DeleteModal({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[200]
        bg-black/50 backdrop-blur-sm
        flex items-center justify-center
        px-4 sm:px-6
        animate-fade-in
      "
    >
      {/* MODAL BOX */}
      <div
        className="
          w-full max-w-md
          rounded-2xl 
          bg-[var(--card-bg)] dark:bg-[var(--card-bg)]
          border border-[var(--card-border)]
          shadow-2xl
          p-6 relative
          animate-slide-up
        "
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="
            absolute top-4 right-4 
            p-2 rounded-lg
            text-gray-600 hover:text-gray-300
            hover:bg-black/10 dark:hover:bg-white/10
            transition
          "
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 dark:bg-red-900/40 text-red-600 rounded-full p-2">
            <Trash2 className="w-5 h-5" />
          </div>

          <h2 className="text-xl font-semibold text-[var(--text-dark)] dark:text-white">
            Strategie verwijderen
          </h2>
        </div>

        {/* BODY */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Weet je zeker dat je deze strategie wilt verwijderen?
          <br />
          <span className="text-red-600 dark:text-red-400 font-medium">
            Dit kan niet ongedaan worden gemaakt.
          </span>
        </p>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-xl
              bg-gray-100 hover:bg-gray-200
              dark:bg-gray-800 dark:hover:bg-gray-700
              border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-gray-100
              font-medium shadow-sm
              transition
            "
          >
            Annuleren
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-xl
              bg-red-600 text-white font-semibold 
              hover:bg-red-700
              shadow-md
              transition
            "
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}
