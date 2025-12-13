"use client";

import { useState, useMemo } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
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
  const { showSnackbar } = useModal();

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

  /* ===========================================================
     FILTER: Alleen manual setups zonder bestaande strategie
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
      const selected = filteredSetups.find(
        (s) => String(s.id) === String(value)
      );

      setForm((prev) => ({
        ...prev,
        setup_id: value,
        symbol: selected?.symbol || "",
        timeframe: selected?.timeframe || "",
      }));
      setError("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  /* ===========================================================
     SUBMIT
  =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.setup_id) {
      setError("⚠️ Kies een setup.");
      return;
    }

    const entry = parseFloat(form.entry);
    const target = parseFloat(form.target);
    const stop_loss = parseFloat(form.stop_loss);

    if ([entry, target, stop_loss].some((v) => Number.isNaN(v))) {
      setError("⚠️ Entry, target en stop-loss moeten geldige getallen zijn.");
      return;
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

      showSnackbar("Handmatige strategie opgeslagen", "success");

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
    } catch (err) {
      console.error("❌ Error saving manual strategy:", err);
      showSnackbar("Opslaan van strategie mislukt", "danger");
      setError("❌ Opslaan mislukt.");
    } finally {
      setSaving(false);
    }
  };

  const disabled =
    saving || !form.setup_id || !form.entry || !form.target || !form.stop_loss;

  /* ===========================================================
     UI
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
      <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--text-dark)]">
        <Pencil className="w-5 h-5 text-purple-600" />
        {mode === "edit"
          ? "Handmatige strategie bewerken"
          : "Nieuwe Handmatige Strategie"}
      </h3>

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
          className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-[#111]"
        >
          <option value="">-- Kies een setup --</option>
          {filteredSetups.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.symbol} – {s.timeframe})
            </option>
          ))}
        </select>
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
          className="w-full p-3 rounded-xl border"
        />
      </div>

      {/* Target */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Target prijs (€)
        </label>
        <input
          name="target"
          type="number"
          value={form.target}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
        />
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
          className="w-full p-3 rounded-xl border"
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
            className="w-full p-3 rounded-xl border"
          />
        </div>
      </div>

      {/* Favoriet */}
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
          <span className="flex items-center gap-1 text-gray-600">
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

      {hideSubmit && (
        <button id="strategy-edit-submit" type="submit" className="hidden">
          Submit
        </button>
      )}
    </form>
  );
}
