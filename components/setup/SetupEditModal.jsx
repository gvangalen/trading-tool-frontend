'use client';

import { useEffect } from 'react';
import SetupForm from '@/components/setup/SetupForm';

export default function SetupEditModal({ open, onClose, setup, reload }) {
  // ESC sluit modal
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  if (!open || !setup) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <div
        className="
          bg-white dark:bg-gray-900 rounded-xl shadow-xl 
          w-full max-w-xl
          max-h-[85vh] overflow-y-auto
          relative p-6
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        {/* EDIT FORM */}
        <SetupForm
          mode="edit"
          initialData={setup}
          onSaved={() => {
            reload();
            onClose();
          }}
        />

        {/* --- FOOTER BUTTONS --- */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-md 
              bg-gray-200 hover:bg-gray-300 
              dark:bg-gray-700 dark:hover:bg-gray-600
              text-gray-700 dark:text-gray-200
              font-medium
            "
          >
            ❌ Annuleren
          </button>

          <button
            onClick={() => {
              // Triggert de submit-button in SetupForm
              document.querySelector('#setup-edit-submit')?.click();
            }}
            className="
              px-4 py-2 rounded-md 
              bg-blue-600 hover:bg-blue-700 
              text-white font-semibold
            "
          >
            💾 Update uitvoeren
          </button>
        </div>
      </div>
    </div>
  );
}
