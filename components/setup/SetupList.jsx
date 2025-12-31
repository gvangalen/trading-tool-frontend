"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import { generateExplanation } from "@/lib/api/setups";
import AILoader from "@/components/ui/AILoader";

import {
  Star,
  StarOff,
  Bot,
  TrendingUp,
  TrendingDown,
  Scale,
  Clock,
  User,
  Brain,
  DollarSign,
  Tag,
  Pencil,
  Trash,
} from "lucide-react";

export default function SetupList({
  setups = [],
  loading,
  error,
  searchTerm = "",
  saveSetup,
  removeSetup,
  reload,
}) {
  const { openConfirm, showSnackbar } = useModal();

  // 🔥 FIX: lokale state i.p.v. direct props renderen
  const [localSetups, setLocalSetups] = useState(setups);

  const [aiLoading, setAiLoading] = useState({});
  const [justUpdated, setJustUpdated] = useState({});

  // 🔄 sync wanneer props veranderen
  useEffect(() => {
    setLocalSetups(setups);
  }, [setups]);

  /* ---------------------------------------------------------
     🔍 FILTERS
  --------------------------------------------------------- */
  const filteredSetups = !searchTerm
    ? localSetups
    : localSetups.filter((s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  /* ---------------------------------------------------------
     🤖 AI UITLEG GENEREREN
  --------------------------------------------------------- */
  async function handleGenerateExplanation(id) {
    try {
      setAiLoading((prev) => ({ ...prev, [id]: true }));

      const res = await generateExplanation(id);

      // ✅ DIRECT UI UPDATE (dit miste)
      if (res?.explanation) {
        setLocalSetups((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, explanation: res.explanation } : s
          )
        );
      }

      showSnackbar("AI-uitleg succesvol gegenereerd!", "success");

      setJustUpdated((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setJustUpdated((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error(err);
      showSnackbar("AI generatie mislukt.", "danger");
    } finally {
      setAiLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  /* ---------------------------------------------------------
     🗑️ DELETE SETUP
  --------------------------------------------------------- */
  function openDeleteModal(id) {
    openConfirm({
      title: "Setup verwijderen",
      description: (
        <p className="leading-relaxed">
          Weet je zeker dat je deze setup wilt verwijderen?
          <br />
          <span className="text-red-600 font-medium">
            Dit kan niet ongedaan worden gemaakt.
          </span>
        </p>
      ),
      icon: <Trash />,
      tone: "danger",
      confirmText: "Verwijderen",
      cancelText: "Annuleren",
      onConfirm: async () => {
        try {
          await removeSetup(id);
          showSnackbar("Setup verwijderd.", "success");
          reload && reload();
        } catch (err) {
          console.error(err);
          showSnackbar("Verwijderen mislukt.", "danger");
        }
      },
    });
  }

  /* ---------------------------------------------------------
     ✏️ EDIT SETUP
  --------------------------------------------------------- */
  function openEditModal(setup) {
    openConfirm({
      title: `Setup bewerken – ${setup.name}`,
      icon: <Pencil />,
      tone: "primary",
      confirmText: "Opslaan",
      cancelText: "Annuleren",
      description: <SetupFormWrapper setup={setup} />,
      onConfirm: async () => {
        document.querySelector("#setup-edit-submit")?.click();
      },
    });
  }

  function SetupFormWrapper({ setup }) {
    const SetupForm = require("@/components/setup/SetupForm").default;

    return (
      <div className="space-y-6 pt-4">
        <SetupForm
          mode="edit"
          initialData={setup}
          onSaved={() => {
            reload && reload();
            showSnackbar("Setup bijgewerkt!", "success");
          }}
        />
      </div>
    );
  }

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */
  return (
    <div className="space-y-6 mt-4">
      {loading && <p className="text-sm text-gray-500">📡 Setups laden...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSetups.length > 0 ? (
          filteredSetups.map((setup) => {
            const trend = (setup.trend || "").toLowerCase();

            const trendIcon =
              trend === "bullish" ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : trend === "bearish" ? (
                <TrendingDown size={16} className="text-red-600" />
              ) : (
                <Scale size={16} className="text-yellow-600" />
              );

            return (
              <div
                key={setup.id}
                className={`
                  relative rounded-2xl p-5 
                  border border-[var(--card-border)]
                  bg-[var(--card-bg)] shadow-sm
                  transition-all duration-200
                  hover:shadow-md hover:-translate-y-[2px]
                  ${justUpdated[setup.id] ? "ring-2 ring-green-500" : ""}
                `}
              >
                {/* AI overlay */}
                {aiLoading[setup.id] && (
                  <div className="absolute inset-0 rounded-2xl bg-white/50 dark:bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center">
                    <AILoader variant="dots" size="md" text="AI-analyse..." />
                  </div>
                )}

                {/* Favoriet */}
                <button
                  onClick={() =>
                    openEditModal({ ...setup, favorite: !setup.favorite })
                  }
                  className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500"
                >
                  {setup.favorite ? (
                    <Star size={20} className="text-yellow-500" />
                  ) : (
                    <StarOff size={20} />
                  )}
                </button>

                <h3 className="font-bold text-lg mb-2">{setup.name}</h3>

                <div className="flex items-center gap-2 mb-1 text-sm">
                  {trendIcon}
                  <span>{setup.trend || "Onbekend"}</span>
                </div>

                <div className="text-xs mt-3 whitespace-pre-line bg-[var(--bg-soft)] p-3 rounded-xl border">
                  {setup.explanation || "Geen uitleg beschikbaar."}
                </div>

                <button
                  onClick={() => handleGenerateExplanation(setup.id)}
                  disabled={aiLoading[setup.id]}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white bg-[var(--primary)]"
                >
                  <Bot size={15} />
                  {aiLoading[setup.id] ? "Bezig…" : "Genereer AI-uitleg"}
                </button>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => openEditModal(setup)}
                    className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm"
                  >
                    <Pencil size={14} /> Bewerken
                  </button>
                  <button
                    onClick={() => openDeleteModal(setup.id)}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
                  >
                    <Trash size={14} /> Verwijder
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">📭 Geen setups gevonden.</p>
        )}
      </div>
    </div>
  );
}
