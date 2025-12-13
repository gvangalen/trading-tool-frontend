"use client";

import { useState, useEffect } from "react";
import { useSetupData } from "@/hooks/useSetupData";
import { useModal } from "@/components/ui/ModalProvider";

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
} from "lucide-react";

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

    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  /* ==========================================================
     VALIDATIE
  ========================================================== */
  const isFormValid = () =>
    form.setup_id && Number(form.amount) > 0 && form.frequency;

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
      className="
        w-full max-w-2xl mx-auto
        bg-white dark:bg-[#0f0f0f]
        p-6 sm:p-8 
        rounded-2xl shadow-xl border
        border-gray-200 dark:border-gray-800
        space-y-6
      "
    >
      <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--text-dark)]">
        <Wallet className="w-5 h-5 text-blue-600" />
        {mode === "edit" ? "DCA-strategie bewerken" : "Nieuwe DCA-strategie"}
      </h2>

      {/* SETUP SELECT */}
      <div>
        <label className="block font-semibold text-sm mb-1 flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-400" />
          Koppel aan Setup
        </label>

        <select
          name="setup_id"
          value={form.setup_id}
          disabled={mode === "edit"}
          onChange={handleChange}
          className="
            w-full p-3 rounded-xl border
            bg-gray-50 dark:bg-[#111]
            border-gray-300 dark:border-gray-700
            focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <option value="">
            {availableSetups.length === 0
              ? "⚠️ Geen DCA-setups beschikbaar"
              : "-- Kies een setup --"}
          </option>

          {availableSetups.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.symbol} – {s.timeframe})
            </option>
          ))}
        </select>
      </div>

      {/* SYMBOL + TIMEFRAME */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
            <Coins className="w-4 h-4 text-gray-400" />
            Symbol
          </label>
          <input
            value={form.symbol}
            readOnly
            className="w-full p-3 rounded-xl border bg-gray-100 dark:bg-[#111] border-gray-300 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            Timeframe
          </label>
          <input
            value={form.timeframe}
            readOnly
            className="w-full p-3 rounded-xl border bg-gray-100 dark:bg-[#111] border-gray-300 dark:border-gray-700"
          />
        </div>
      </div>

      {/* AMOUNT */}
      <div>
        <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
          <Coins className="w-4 h-4 text-gray-400" />
          Bedrag per keer (€)
        </label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          min="1"
          onChange={handleChange}
          className="w-full p-3 rounded-xl border bg-white dark:bg-[#111] border-gray-300 dark:border-gray-700"
        />
      </div>

      {/* FREQUENCY */}
      <div>
        <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          Frequentie
        </label>
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border bg-white dark:bg-[#111] border-gray-300 dark:border-gray-700"
        >
          <option value="">-- Kies frequentie --</option>
          <option value="weekly">Wekelijks</option>
          <option value="monthly">Maandelijks</option>
        </select>
      </div>

      {/* RULES */}
      <div>
        <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-gray-400" />
          Koopregels
        </label>
        <textarea
          name="rules"
          rows={3}
          value={form.rules}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border bg-white dark:bg-[#111] border-gray-300 dark:border-gray-700"
        />
      </div>

      {/* TAGS */}
      <div>
        <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          Tags
        </label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border bg-white dark:bg-[#111] border-gray-300 dark:border-gray-700"
        />
      </div>

      {/* FAVORIET */}
      <label className="flex items-center gap-3 text-sm font-medium">
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
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <StarOff className="w-4 h-4" /> Geen favoriet
          </span>
        )}
      </label>

      {/* ERROR */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* SUBMIT */}
      {!hideSubmit && mode === "create" && (
        <button
          type="submit"
          disabled={!valid}
          className={`btn-primary w-full mt-4 ${
            !valid ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          DCA-strategie opslaan
        </button>
      )}

      {hideSubmit && mode === "edit" && (
        <button id="strategy-edit-submit" type="submit" className="hidden">
          submit
        </button>
      )}
    </form>
  );
}
