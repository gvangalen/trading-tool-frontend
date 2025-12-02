"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, X } from "lucide-react";

function DeleteModalContent({ onConfirm, onCancel }) {
  return (
    <div
      className="
        fixed inset-0 
        bg-black/40 backdrop-blur-sm 
        flex items-center justify-center
        z-[9999]
      "
    >
      <div
        className="
          bg-white dark:bg-gray-900 
          rounded-2xl shadow-2xl 
          p-6 w-full max-w-md mx-4
          animate-fade-slide
          relative
        "
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="
            absolute top-4 right-4 
            text-gray-500 hover:text-gray-700
            dark:text-gray-400 dark:hover:text-gray-200
            transition
          "
        >
          <X className="w-5 h-5" />
        </button>

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
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Weet je zeker dat je deze strategie wilt verwijderen?
          <br />
          <span className="text-red-600 dark:text-red-400 font-medium">
            Dit kan niet ongedaan worden gemaakt.
          </span>
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg 
              border border-gray-300 dark:border-gray-700
              text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
          >
            Annuleren
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-lg 
              bg-red-600 hover:bg-red-700 
              text-white shadow-sm transition
            "
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DeleteModal({ open, onConfirm, onCancel }) {
  if (typeof window === "undefined") return null;

  // FIX: scroll lock correct toepassen
  useEffect(() => {
    if (open) {
      // Scroll lock EN fix voor iOS/overscroll
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      // Altijd herstellen
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      // Cleanup als component unmount
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <DeleteModalContent onConfirm={onConfirm} onCancel={onCancel} />,
    document.body
  );
}
