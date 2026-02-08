"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import { generateExplanation } from "@/lib/api/setups";
import AILoader from "@/components/ui/AILoader";

import {
  Star,
  StarOff,
  Bot,
  Clock,
  Brain,
  Pencil,
  Trash,
} from "lucide-react";

/* =========================================================
   🧠 SCORE INTERPRETATIE (zelfde semantiek als SetupForm)
========================================================= */
const scoreLabel = (v) => {
  if (v <= 25) return "Sterk bearish / risk-off";
  if (v <= 45) return "Bearish";
  if (v <= 60) return "Neutraal";
  if (v <= 75) return "Neutraal → bullish";
  if (v <= 90) return "Bullish";
  return "Euforisch / oververhit";
};

const rangeText = (min, max) =>
  `${scoreLabel(min)} → ${scoreLabel(max)}`;

/* =========================================================
   COMPONENT
========================================================= */
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

  // lokale state voor directe AI updates
  const [localSetups, setLocalSetups] = useState(setups);
  const [aiLoading, setAiLoading] = useState({});
  const [justUpdated, setJustUpdated] = useState({});

  useEffect(() => {
    setLocalSetups(setups);
  }, [setups]);

  /* ---------------------------------------------------------
     FILTER
  --------------------------------------------------------- */
  const filteredSetups = !searchTerm
    ? localSetups
    : localSetups.filter((s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  /* ---------------------------------------------------------
     AI UITLEG
  --------------------------------------------------------- */
  async function handleGenerateExplanation(id) {
    try {
      setAiLoading((p) => ({ ...p, [id]: true }));

      const res = await generateExplanation(id);

      if (res?.explanation) {
        setLocalSetups((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, explanation: res.explanation } : s
          )
        );
      }

      showSnackbar("AI-uitleg succesvol gegenereerd", "success");

      setJustUpdated((p) => ({ ...p, [id]: true }));
      setTimeout(() => {
        setJustUpdated((p) => ({ ...p, [id]: false }));
      }, 1500);
    } catch (e) {
      console.error(e);
      showSnackbar("AI generatie mislukt", "danger");
    } finally {
      setAiLoading((p) => ({ ...p, [id]: false }));
    }
  }

  /* ---------------------------------------------------------
     DELETE
  --------------------------------------------------------- */
  function openDeleteModal(id) {
    openConfirm({
      title: "Setup verwijderen",
      tone: "danger",
      confirmText: "Verwijderen",
      cancelText: "Annuleren",
      description: (
        <p>
          Weet je zeker dat je deze setup wilt verwijderen?
          <br />
          <span className="text-red-600 font-medium">
            Dit kan niet ongedaan worden gemaakt.
          </span>
        </p>
      ),
      onConfirm: async () => {
        await removeSetup(id);
        reload && reload();
        showSnackbar("Setup verwijderd", "success");
      },
    });
  }

  /* ---------------------------------------------------------
     EDIT
  --------------------------------------------------------- */
  function openEditModal(setup) {
    openConfirm({
      title: `Setup bewerken – ${setup.name}`,
      tone: "primary",
      confirmText: "Opslaan",
      cancelText: "Annuleren",
      description: <SetupFormWrapper setup={setup} />,
      onConfirm: () =>
        document.querySelector("#setup-edit-submit")?.click(),
    });
  }

  function SetupFormWrapper({ setup }) {
    const SetupForm =
      require("@/components/setup/SetupForm").default;

    return (
      <div className="space-y-6 pt-4">
        <SetupForm
          mode="edit"
          initialData={setup}
          onSaved={() => {
            reload && reload();
            showSnackbar("Setup bijgewerkt", "success");
          }}
        />
      </div>
    );
  }

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */
  return (
    <div className="space-y-6 mt-4">
      {loading && <p className="text-sm text-gray-500">Setups laden…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSetups.length > 0 ? (
          filteredSetups.map((setup) => (
            <div
              key={setup.id}
              className={`
                relative rounded-2xl p-5
                border border-[var(--card-border)]
                bg-[var(--card-bg)]
                transition-all
                hover:shadow-lg hover:-translate-y-[2px]
                ${justUpdated[setup.id] ? "ring-2 ring-green-500" : ""}
              `}
            >
              {/* AI overlay */}
              {aiLoading[setup.id] && (
                <div className="absolute inset-0 z-20 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <AILoader variant="dots" size="md" text="AI analyse…" />
                </div>
              )}

              {/* Favorite */}
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

              {/* Titel */}
              <h3 className="font-bold text-lg mb-1">{setup.name}</h3>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-[var(--text-light)] mb-3">
                <div className="flex items-center gap-1">
                  <Clock size={14} /> {setup.timeframe}
                </div>
                <div className="flex items-center gap-1">
                  <Brain size={14} /> {setup.strategy_type}
                </div>
              </div>

              {/* SCORE RANGES */}
              <div className="space-y-2 text-xs bg-[var(--bg-soft)] p-3 rounded-xl border">
                <div>
                  <strong>Macro:</strong>{" "}
                  {setup.min_macro_score}–{setup.max_macro_score}
                  <div className="opacity-70">
                    {rangeText(
                      setup.min_macro_score,
                      setup.max_macro_score
                    )}
                  </div>
                </div>

                <div>
                  <strong>Technical:</strong>{" "}
                  {setup.min_technical_score}–{setup.max_technical_score}
                  <div className="opacity-70">
                    {rangeText(
                      setup.min_technical_score,
                      setup.max_technical_score
                    )}
                  </div>
                </div>

                <div>
                  <strong>Market:</strong>{" "}
                  {setup.min_market_score}–{setup.max_market_score}
                  <div className="opacity-70">
                    {rangeText(
                      setup.min_market_score,
                      setup.max_market_score
                    )}
                  </div>
                </div>
              </div>

              {/* UITLEG */}
              <div className="mt-3 text-xs whitespace-pre-line bg-[var(--bg-soft)] p-3 rounded-xl border">
                {setup.explanation || "Geen uitleg beschikbaar."}
              </div>

              {/* AI knop */}
              <button
                onClick={() => handleGenerateExplanation(setup.id)}
                disabled={aiLoading[setup.id]}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
              >
                <Bot size={15} />
                {aiLoading[setup.id] ? "Bezig…" : "Genereer AI-uitleg"}
              </button>

              {/* Acties */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => openEditModal(setup)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Pencil size={14} /> Bewerken
                </button>
                <button
                  onClick={() => openDeleteModal(setup.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash size={14} /> Verwijder
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Geen setups gevonden.</p>
        )}
      </div>
    </div>
  );
}
