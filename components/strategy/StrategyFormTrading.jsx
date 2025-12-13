"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Star,
  StarOff,
  Tag,
  Target,
  TrendingUp,
} from "lucide-react";

import { useModal } from "@/components/modal/ModalProvider";

export default function StrategyFormTrading({
  setups = [],
  onSubmit,
  mode = "create",
  initialData = null,
  hideSubmit = false,
}) {
  const { showSnackbar } = useModal();

  /* ===========================================================
     FORM STATE
  =========================================================== */
  const [form, setForm] = useState({
    setup_id: initialData?.setup_id || "",
    symbol: initialData?.symbol || "",
    timeframe: initialData?.timeframe || "",
    entry: initialData?.entry || "",
    targetsText: Array.isArray(initialData?.targets)
      ? initialData.targets.join(", ")
      : "",
    stop_loss: initialData?.stop_loss || "",
    explanation: initialData?.explanation || "",
    favorite: initialData?.favorite || false,
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* ===========================================================
     SETUPS FILTEREN
  =========================================================== */
  const availableSetups = useMemo(
    () =>
      Array.isArray(setups)
        ? setups.filter(
            (s) => String(s.strategy_type).toLowerCase() === "trading"
          )
        : [],
    [setups]
  );

  /* ===========================================================
     INITIALDATA HANDLER
  =========================================================== */
  useEffect(() => {
    if (!initialData) return;

    setForm({
      setup_id: initialData.setup_id,
      symbol: initialData.symbol,
      timeframe: initialData.timeframe,
      entry: initialData.entry,
      targetsText: Array.isArray(initialData.targets)
        ? initialData.targets.join(", ")
        : "",
      stop_loss: initialData.stop_loss,
      explanation: initialData.explanation ?? "",
      favorite: initialData.favorite ?? false,
      tags: Array.isArray(initialData.tags)
        ? initialData.tags.join(", ")
        : "",
    });
  }, [initialData]);

  /* ===========================================================
     CHANGE HANDLER
  =========================================================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setError("");

    if (name === "setup_id") {
      const selected = availableSetups.find(
        (s) => String(s.id) === String(val)
      );

      setForm((prev) => ({
        ...prev,
        setup_id: val,
        symbol: selected?.symbol || "",
        timeframe: selected?.timeframe || "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  /* ===========================================================
     SUBMIT
  =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.setup_id)
      return setError("❌ Kies eerst een setup.");

    if (!form.entry || !form.targetsText || !form.stop_loss)
      return setError("❌ Entry, targets en stop-loss zijn verplicht.");

    const entry = parseFloat(form.entry);
    const stop_loss = parseFloat(form.stop_loss);

    const targets = form.targetsText
      .split(",")
      .map((t) => parseFloat(t.trim()))
      .filter((n) => !Number.isNaN(n));

    if (Number.isNaN(entry) || Number.isNaN(stop_loss) || targets.length === 0)
      return setError("❌ Gebruik geldige getallen.");

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      setup_id: Number(form.setup_id),
      entry,
      targets,
      stop_loss,
      explanation: form.explanation.trim(),
      favorite: form.favorite,
      tags,
    };

    try {
      setSaving(true);
      await onSubmit(payload);

      showSnackbar("Strategie succesvol opgeslagen", "success");

      if (mode === "create") {
        setForm({
          setup_id: "",
          symbol: "",
          timeframe: "",
          entry: "",
          targetsText: "",
          stop_loss: "",
          explanation: "",
          favorite: false,
          tags: "",
        });
      }
    } catch (err) {
      console.error("❌ Error saving strategy:", err);
      showSnackbar("Opslaan van strategie mislukt", "danger");
    } finally {
      setSaving(false);
    }
  };

  const disabled =
    saving ||
    !form.setup_id ||
    !form.entry ||
    !form.targetsText ||
    !form.stop_loss;

  /* ===========================================================
     UI
  =========================================================== */
  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-2xl mx-auto
        p-6 sm:p-8 
        rounded-2xl shadow-xl border
        bg-white dark:bg-[#0f0f0f]
        border-gray-200 dark:border-gray-800
        space-y-6
      "
    >
      <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--text-dark)]">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        {mode === "edit"
          ? "Tradingstrategie bewerken"
          : "Nieuwe Tradingstrategie"}
      </h3>

      {/* Setup Select */}
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
            focus:ring-2 focus:ring-blue-500
          "
        >
          <option value="">-- Kies een setup --</option>
          {availableSetups.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.symbol} – {s.timeframe})
            </option>
          ))}
        </select>
      </div>

      {/* Symbol + Timeframe */}
      <div className="grid grid-cols-2 gap-4">
        <input
          value={form.symbol}
          readOnly
          className="p-3 rounded-xl border bg-gray-100 dark:bg-[#111]"
        />
        <input
          value={form.timeframe}
          readOnly
          className="p-3 rounded-xl border bg-gray-100 dark:bg-[#111]"
        />
      </div>

      {/* Entry */}
      <input
        name="entry"
        type="number"
        value={form.entry}
        onChange={handleChange}
        className="p-3 rounded-xl border"
        placeholder="Entry prijs"
      />

      {/* Targets */}
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-gray-400" />
        <input
          name="targetsText"
          value={form.targetsText}
          onChange={handleChange}
          className="p-3 rounded-xl border w-full"
          placeholder="Bijv. 32000, 34000"
        />
      </div>

      {/* Stop-loss */}
      <input
        name="stop_loss"
        type="number"
        value={form.stop_loss}
        onChange={handleChange}
        className="p-3 rounded-xl border"
        placeholder="Stop-loss"
      />

      {/* Tags */}
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-gray-400" />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="p-3 rounded-xl border w-full"
          placeholder="tags"
        />
      </div>

      {/* Favoriet */}
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
          <span className="flex items-center gap-1 text-gray-600">
            <StarOff className="w-4 h-4" /> Geen favoriet
          </span>
        )}
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!hideSubmit && (
        <button
          type="submit"
          disabled={disabled}
          className={`btn-primary w-full ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "⏳ Opslaan..." : "Strategie opslaan"}
        </button>
      )}

      {hideSubmit && (
        <button id="strategy-edit-submit" type="submit" className="hidden">
          Submit
        </button>
      )}
    </form>
  );
}
