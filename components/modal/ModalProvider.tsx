"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { X } from "lucide-react";

/* ===========================================================
   TYPES
=========================================================== */

type ModalTone = "primary" | "danger" | "info";

export type ModalConfig = {
  title?: string;
  description?: ReactNode;
  icon?: ReactNode;
  tone?: ModalTone;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

type ModalContextValue = {
  openConfirm: (config: ModalConfig) => void;
  close: () => void;
};

/* ===========================================================
   CONTEXT
=========================================================== */

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("❌ useModal moet binnen ModalProvider gebruikt worden");
  }
  return ctx;
}

/* ===========================================================
   PROVIDER
=========================================================== */

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const [busy, setBusy] = useState(false);

  const close = useCallback(() => {
    if (busy) return;
    if (modal?.onCancel) modal.onCancel();
    setModal(null);
  }, [modal, busy]);

  const openConfirm = useCallback((config: ModalConfig) => {
    setBusy(false);
    setModal(config);
  }, []);

  // Scroll lock + ESC
  useEffect(() => {
    if (!modal) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [modal, close]);

  return (
    <ModalContext.Provider value={{ openConfirm, close }}>
      {children}
      <ModalRoot modal={modal} busy={busy} setBusy={setBusy} onClose={close} />
    </ModalContext.Provider>
  );
}

/* ===========================================================
   MODAL ROOT – UI
=========================================================== */

function ModalRoot({
  modal,
  busy,
  setBusy,
  onClose,
}: {
  modal: ModalConfig | null;
  busy: boolean;
  setBusy: (v: boolean) => void;
  onClose: () => void;
}) {
  if (!modal) return null;

  const {
    title = "Bevestigen",
    description,
    icon,
    tone = "primary",
    confirmText = "Bevestigen",
    cancelText = "Annuleren",
    onConfirm,
  } = modal;

  const toneClasses =
    tone === "danger"
      ? {
          iconBg: "bg-red-100 dark:bg-red-900/40",
          iconText: "text-red-600",
          confirm: "bg-red-600 hover:bg-red-700",
        }
      : tone === "info"
      ? {
          iconBg: "bg-blue-100 dark:bg-blue-900/40",
          iconText: "text-blue-600",
          confirm: "bg-blue-600 hover:bg-blue-700",
        }
      : {
          iconBg: "bg-[var(--primary-soft)]",
          iconText: "text-[var(--primary)]",
          confirm: "bg-[var(--primary)] hover:brightness-90",
        };

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose();
      return;
    }

    try {
      setBusy(true);
      await onConfirm();
      onClose();
    } catch (e) {
      console.error("❌ Modal onConfirm error:", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[210]
        bg-black/55 backdrop-blur-sm
        flex items-center justify-center
        px-4 animate-fade-in
      "
    >
      <div
        className="
          w-full max-w-md
          bg-[var(--card-bg)] dark:bg-[var(--card-bg)]
          border border-[var(--card-border)]
          rounded-2xl shadow-2xl
          p-6 sm:p-7
          animate-fade-slide
          relative
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3 
            p-2 rounded-lg
            text-gray-500 hover:text-gray-800 dark:hover:text-gray-100
            hover:bg-black/10 dark:hover:bg-white/10
            transition
          "
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div
              className={`rounded-full p-2 ${toneClasses.iconBg} flex items-center justify-center`}
            >
              <div className={toneClasses.iconText}>{icon}</div>
            </div>
          )}
          <h2 className="text-xl font-semibold text-[var(--text-dark)] dark:text-white">
            {title}
          </h2>
        </div>

        {/* Body */}
        {description && (
          <div className="text-sm text-gray-700 dark:text-gray-200 mb-6">
            {description}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            disabled={busy}
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl text-sm
              border border-gray-300 dark:border-gray-700
              text-gray-700 dark:text-gray-200
              bg-gray-50 dark:bg-gray-900
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
          >
            {cancelText}
          </button>

          <button
            disabled={busy}
            onClick={handleConfirm}
            className={`
              px-4 py-2 rounded-xl text-sm text-white shadow-md
              disabled:opacity-60 disabled:cursor-not-allowed
              ${toneClasses.confirm}
            `}
          >
            {busy ? "Bezig…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
