"use client";

import { useState, useEffect } from "react";
import { useSetupData } from "@/hooks/useSetupData";
import { useModal } from "@/components/modal/ModalProvider";

import {
  Coins,
  Calendar,
  Info,
  Tag,
  Star,
  StarOff,
  ClipboardList,
  Wallet,
  Clock,
  Sliders,
} from "lucide-react";

import CurveEditor from "@/components/decision/CurveEditor";

/* ==========================================================
   Curve presets (frontend only)
========================================================== */
const CURVE_PRESETS = {
  fixed: null,

  dca_contrarian: {
    input: "market_score",
    points: [
      { x: 20, y: 1.5 },
      { x: 40, y: 1.2 },
      { x: 60, y: 1.0 },
      { x: 80, y: 0.5 },
    ],
  },

  dca_trend_following: {
    input: "market_score",
    points: [
      { x: 20, y: 0.6 },
      { x: 40, y: 0.9 },
      { x: 60, y: 1.2 },
      { x: 80, y: 1.4 },
    ],
  },
};

export default function StrategyFormDCA({
  onSubmit,
  setups = [],
  initialData = null,
  mode = "create",
  hideSubmit = false,
}) {
  const { loadSetups } = useSetupData();
  const { showSnackbar } = useModal();

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    setup_id: initialData?.setup_id || "",
    setup_name: initialData?.setup_name || "",
    symbol: initialData?.symbol || "",
    timeframe: initialData?.timeframe || "",

    amount: initialData?.amount || "",
    frequency: initialData?.frequency || "",

    scaling_profile: initialData?.scaling_profile || "fixed",
    decision_curve: initialData?.decision_curve || null,

    rules: initialData?.rules || "",
    favorite: initialData?.favorite || false,
    tags: initialData?.tags?.join(", ") || "",
  });

  useEffect(() => {
    loadSetups();
  }, []);

  /* ==========================================================
     FILTER: alleen DCA setups
  ========================================================== */
  const availableSetups = setups.filter(
    (s) => s.strategy_type?.toLowerCase() === "dca"
  );

  /* ==========================================================
     CHANGE HANDLER
  ========================================================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === "setup_id") {
      const selected = availableSetups.find(
        (s) => String(s.id) === String(value)
      );

      if (!selected) {
        setError("❌ Ongeldige setup geselecteerd.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        setup_id: selected.id,
        setup_name: selected.name,
        symbol: selected.symbol,
        timeframe: selected.timeframe,
      }));

      setError("");
      return;
    }

    if (name === "scaling_profile") {
      if (value === "custom") {
        setForm((prev) => ({
          ...prev,
          scaling_profile: "custom",
          decision_curve:
            prev.decision_curve ??
            JSON.parse(JSON.stringify(CURVE_PRESETS.dca_contrarian)),
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          scaling_profile: value,
          decision_curve: CURVE_PRESETS[value],
        }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  /* ==========================================================
     VALIDATIE
  ========================================================== */
  const isFormValid = () =>
    form.setup_id &&
    Number(form.amount) > 0 &&
    form.frequency &&
    (form.scaling_profile === "fixed" || form.decision_curve);

  /* ==========================================================
     SUBMIT
  ========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isFormValid()) {
      setError("❌ Vul alle verplichte velden correct in.");
      return;
    }

    const payload = {
      strategy_type: "dca",
      setup_id: form.setup_id,
      setup_name: form.setup_name,
      symbol: form.symbol,
      timeframe: form.timeframe,

      amount: Number(form.amount),
      frequency: form.frequency,

      scaling_profile: form.scaling_profile,
      decision_curve:
        form.scaling_profile === "fixed" ? null : form.decision_curve,

      rules: form.rules?.trim() || "",
      favorite: !!form.favorite,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],

      origin: "DCA",
    };

    try {
      await onSubmit(payload);
      showSnackbar("DCA-strategie succesvol opgeslagen", "success");

      if (mode === "create") {
        setForm({
          setup_id: "",
          setup_name: "",
          symbol: "",
          timeframe: "",
          amount: "",
          frequency: "",
          scaling_profile: "fixed",
          decision_curve: null,
          rules: "",
          favorite: false,
          tags: "",
        });
      }
    } catch (err) {
      console.error("❌ Fout bij opslaan DCA strategie:", err);
      showSnackbar("Opslaan van DCA-strategie mislukt", "danger");
      setError("❌ Opslaan mislukt.");
    }
  };

  const valid = isFormValid();

  /* ==========================================================
     UI
  ========================================================== */
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white dark:bg-[#0f0f0f] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 space-y-6"
    >
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Wallet className="w-5 h-5 text-blue-600" />
        {mode === "edit" ? "DCA-strategie bewerken" : "Nieuwe DCA-strategie"}
      </h2>

      {/* SETUP */}
      <div>
        <label className="text-sm font-semibold flex items-center gap-2 mb-1">
          <Info className="w-4 h-4 text-gray-400" />
          Koppel aan Setup
        </label>

        <select
          name="setup_id"
          value={form.setup_id}
          disabled={mode === "edit"}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-[#111]"
        >
          <option value="">
            {availableSetups.length === 0
              ? "Geen DCA-setups beschikbaar"
              : "-- Kies een setup --"}
          </option>

          {availableSetups.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.symbol} – {s.timeframe})
            </option>
          ))}
        </select>
      </div>

      {/* SYMBOL / TIMEFRAME */}
      <div className="grid grid-cols-2 gap-4">
        <input
          readOnly
          value={form.symbol}
          className="p-3 rounded-xl border bg-gray-100"
        />
        <input
          readOnly
          value={form.timeframe}
          className="p-3 rounded-xl border bg-gray-100"
        />
      </div>

      {/* AMOUNT / FREQUENCY */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="amount"
          min="1"
          value={form.amount}
          onChange={handleChange}
          className="p-3 rounded-xl border"
          placeholder="Bedrag per keer (€)"
        />

        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="p-3 rounded-xl border"
        >
          <option value="">Frequentie</option>
          <option value="weekly">Wekelijks</option>
          <option value="monthly">Maandelijks</option>
        </select>
      </div>

      {/* SCALING */}
      <div>
        <label className="text-sm font-semibold flex items-center gap-2 mb-1">
          <Sliders className="w-4 h-4 text-gray-400" />
          Investeringsverdeling
        </label>

        <select
          name="scaling_profile"
          value={form.scaling_profile}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
        >
          <option value="fixed">Vast bedrag</option>
          <option value="dca_contrarian">Contrarian</option>
          <option value="dca_trend_following">Trend following</option>
          <option value="custom">Custom curve</option>
        </select>
      </div>

      {form.scaling_profile !== "fixed" && (
        <CurveEditor
          value={form.decision_curve}
          onChange={(curve) =>
            setForm((prev) => ({ ...prev, decision_curve: curve }))
          }
        />
      )}

      {/* RULES */}
      <textarea
        name="rules"
        rows={3}
        value={form.rules}
        onChange={handleChange}
        className="w-full p-3 rounded-xl border"
        placeholder="Koopregels / notities"
      />

      {/* TAGS */}
      <input
        name="tags"
        value={form.tags}
        onChange={handleChange}
        className="w-full p-3 rounded-xl border"
        placeholder="Tags (komma)"
      />

      {/* FAVORIET */}
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="favorite"
          checked={form.favorite}
          onChange={handleChange}
        />
        {form.favorite ? (
          <span className="flex items-center gap-1 text-yellow-600">
            <Star className="w-4 h-4" /> Favoriet
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-500">
            <StarOff className="w-4 h-4" /> Geen favoriet
          </span>
        )}
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!hideSubmit && (
        <button
          type="submit"
          disabled={!valid}
          className={`btn-primary w-full ${
            !valid ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          DCA-strategie opslaan
        </button>
      )}
    </form>
  );
}
