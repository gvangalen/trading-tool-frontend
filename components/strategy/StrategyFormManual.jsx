"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Info,
  Pencil,
  Target,
  Tag,
  Star,
  StarOff,
} from "lucide-react";

export default function StrategyFormManual({
  onSubmit,
  setups = [],
  strategies = [],
  initialData = null,
  mode = "create",
  hideSubmit = false,
}) {
  /* ===========================================================
     FORM STATE
  =========================================================== */
  const [form, setForm] = useState({
    setup_id: initialData?.setup_id || "",
    symbol: initialData?.symbol || "",
    timeframe: initialData?.timeframe || "",
    entry: initialData?.entry || "",
    target:
      Array.isArray(initialData?.targets) && initialData.targets.length > 0
        ? initialData.targets[0]
        : "",
    stop_loss: initialData?.stop_loss || "",
    explanation: initialData?.explanation || "",
    tags: initialData?.tags?.join(", ") || "",
    favorite: initialData?.favorite || false,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ===========================================================
     FILTER: Alleen manual setups (en geen bestaande strategie)
  =========================================================== */
  const filteredSetups = useMemo(() => {
    return setups.filter((s) => {
      if (s.strategy_type?.toLowerCase() !== "manual") return false;

      const already = strategies.some(
        (st) =>
          String(st.setup_id) === String(s.id) &&
          String(st.strategy_type).toLowerCase() === "manual"
      );

      if (mode === "edit" && String(s.id) === String(initialData?.setup_id)) {
        return true;
      }

      return !already;
    });
  }, [setups, strategies, mode, initialData]);

  /* ===========================================================
     CHANGE HANDLER
  =========================================================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "setup_id") {
      const selected = filteredSetups.find((s) => String(s.id) === String(value));

      setForm((prev) => ({
        ...prev,
        setup_id: value,
        symbol: selected?.symbol || "",
        timeframe: selected?.timeframe || "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess(false);
  };

  /* ===========================================================
     SUBMIT
  =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.setup_id) return setError("⚠️ Kies een setup.");

    const entry = parseFloat(form.entry);
    const target = parseFloat(form.target);
    const stop_loss = parseFloat(form.stop_loss);

    if ([entry, target, stop_loss].some((v) => Number.isNaN(v))) {
      return setError("⚠️ Entry, target en stop-loss moeten geldige getallen zijn.");
    }

    const tags =
      form.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

    const setupObj = filteredSetups.find(
      (s) => String(s.id) === String(form.setup_id)
    );

    const payload = {
      setup_id: Number(form.setup_id),
      setup_name: setupObj?.name || initialData?.setup_name,
      symbol: form.symbol,
      timeframe: form.timeframe,
      strategy_type: "manual",
      entry,
      targets: [target],
      stop_loss,
      explanation: form.explanation.trim(),
      tags,
      favorite: form.favorite,
      origin: "Handmatig",
    };

    try {
      setSaving(true);
      await onSubmit(payload);
      setSuccess(true);

      if (mode === "create") {
        setForm({
          setup_id: "",
          symbol: "",
          timeframe: "",
          entry: "",
          target: "",
          stop_loss: "",
          explanation: "",
          tags: "",
          favorite: false,
        });
      }

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("❌ Error saving manual strategy:", err);
      setError("❌ Opslaan mislukt.");
    } finally {
      setSaving(false);
    }
  };

  const disabled =
    saving || !form.setup_id || !form.entry || !form.target || !form.stop_loss;

  /* ===========================================================
     UI — Fintech PRO 6.0 + btn-primary
  =========================================================== */
  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-2xl mx-auto
        p-6 sm:p-8 space-y-6
        rounded-2xl shadow-xl border
        bg-white dark:bg-[#0f0f0f]
        border-gray-200 dark:border-gray-800
      "
    >
      {/* Titel */}
      <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--text-dark)]">
        <Pencil className="w-5 h-5 text-purple-600" />
        {mode === "edit"
          ? "Handmatige strategie bewerken"
          : "Nieuwe Handmatige Strategie"}
      </h3>

      {/* Success */}
      {success && (
        <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-800 px-4 py-2 rounded-xl text-sm">
          Strategie opgeslagen!
        </div>
      )}

      {/* Setup-select */}
      <div>
        <label className="block text-sm font-semibold mb-1">
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
            focus:ring-2 focus:ring-purple-500
          "
        >
          <option value="">-- Kies een setup --</option>
          {filteredSetups.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.symbol} – {s.timeframe})
            </option>
          ))}
        </select>
      </div>

      {/* Symbol + Timeframe */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Symbol</label>
          <input
            value={form.symbol}
            readOnly
            className="
              w-full p-3 rounded-xl border
              bg-gray-100 dark:bg-[#111]
              border-gray-300 dark:border-gray-700
            "
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Timeframe</label>
          <input
            value={form.timeframe}
            readOnly
            className="
              w-full p-3 rounded-xl border
              bg-gray-100 dark:bg-[#111]
              border-gray-300 dark:border-gray-700
            "
          />
        </div>
      </div>

      {/* Entry */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Entry prijs (€)
        </label>
        <input
          name="entry"
          type="number"
          value={form.entry}
          onChange={handleChange}
          className="
            w-full p-3 rounded-xl border
            bg-white dark:bg-[#111]
            border-gray-300 dark:border-gray-700
          "
        />
      </div>

      {/* Target */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Target prijs (€)
        </label>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-gray-400" />
          <input
            name="target"
            type="number"
            value={form.target}
            onChange={handleChange}
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#111]
              border-gray-300 dark:border-gray-700
            "
          />
        </div>
      </div>

      {/* Stop-loss */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Stop-loss (€)
        </label>
        <input
          name="stop_loss"
          type="number"
          value={form.stop_loss}
          onChange={handleChange}
          className="
            w-full p-3 rounded-xl border
            bg-white dark:bg-[#111]
            border-gray-300 dark:border-gray-700
          "
        />
      </div>

      {/* Uitleg */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Uitleg / notities
        </label>
        <textarea
          name="explanation"
          rows={3}
          value={form.explanation}
          onChange={handleChange}
          className="
            w-full p-3 rounded-xl border
            bg-white dark:bg-[#111]
            border-gray-300 dark:border-gray-700
          "
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold mb-1">Tags</label>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <input
            name="tags"
            type="text"
            value={form.tags}
            onChange={handleChange}
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#111]
              border-gray-300 dark:border-gray-700
            "
          />
        </div>
      </div>

      {/* Favoriet */}
      <label className="flex items-center gap-3 text-sm font-medium mt-2">
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

      {/* Error */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Submit */}
      {!hideSubmit && (
        <button
          type="submit"
          disabled={disabled}
          className={`btn-primary w-full mt-4 ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "⏳ Opslaan..." : "Strategie opslaan"}
        </button>
      )}

      {/* Modal submit */}
      {hideSubmit && (
        <button id="strategy-edit-submit" type="submit" className="hidden">
          Submit
        </button>
      )}
    </form>
  );
}
