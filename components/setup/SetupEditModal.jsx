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

      {/* --- MODAL WRAPPER --- */}
      <div
        className="
          bg-white dark:bg-gray-900 rounded-xl shadow-xl 
          w-full max-w-xl                     /* ✔ SMALLER WIDTH */
          max-h-[85vh] overflow-y-auto        /* ✔ SCROLLABLE */
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
      </div>
    </div>
  );
}
