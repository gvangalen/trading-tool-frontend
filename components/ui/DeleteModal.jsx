"use client";
import { Trash2, X } from "lucide-react";

export default function DeleteModal({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-slide">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 dark:bg-red-900/40 text-red-600 rounded-full p-2">
            <Trash2 size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Strategie verwijderen
          </h2>
        </div>

        {/* Body */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Weet je zeker dat je deze strategie wilt verwijderen?
          Dit kan niet ongedaan worden gemaakt.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
            text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Annuleren
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white 
            hover:bg-red-700 transition shadow-sm"
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}
