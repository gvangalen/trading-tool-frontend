"use client";

import { useState, useMemo } from "react";
import { useModal } from "@/components/modal/ModalProvider";
import CurveEditor from "@/components/decision/CurveEditor";

import {
  Pencil,
  Tag,
  Star,
  StarOff,
  Sliders,
  Euro,
} from "lucide-react";

/* ==========================================================
   Curve presets (zelfde logica als DCA)
========================================================== */
const CURVE_PRESETS = {
  contrarian: {
    input: "market_score",
    points: [
      { x: 20, y: 1.6 },
      { x: 40, y: 1.2 },
      { x: 60, y: 1.0 },
      { x: 80, y: 0.6 },
    ],
  },

  trend_following: {
    input: "market_score",
    points: [
      { x: 20, y: 0.6 },
      { x: 40, y: 0.9 },
      { x: 60, y: 1.2 },
      { x: 80, y: 1.5 },
    ],
  },
};

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

    // ⭐ NIEUW — execution logic
    execution_mode: initialData?.execution_mode || "fixed",
    decision_curve: initialData?.decision_curve || null,
    curve_name: initialData?.curve_name || "",
    base_amount: initialData?.base_amount || "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* ===========================================================
     FILTER: alleen manual setups zonder bestaande strategie
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
      return;
    }

    if (name === "execution_mode") {
      if (value === "custom") {
        setForm((p) => ({
          ...p,
          execution_mode: "custom",
          decision_curve:
            p.decision_curve ??
            JSON.parse(JSON.stringify(CURVE_PRESETS.contrarian)),
        }));
      } else if (value === "fixed") {
        setForm((p) => ({
          ...p,
          execution_mode: "fixed",
          decision_curve: null,
          curve_name: "",
        }));
      } else {
        setForm((p) => ({
          ...p,
          execution_mode: value,
          decision_curve: CURVE_PRESETS[value],
          curve_name: "",
        }));
      }
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

    const payload = {
      setup_id: Number(form.setup_id),
      strategy_type: "manual",
      symbol: form.symbol,
      timeframe: form.timeframe,
      entry,
      targets: [target],
      stop_loss,
      explanation: form.explanation.trim(),
      tags,
      favorite: form.favorite,

      // ⭐ execution engine velden
      execution_mode: form.execution_mode,
      base_amount: Number(form.base_amount),
      decision_curve:
        form.execution_mode === "fixed" ? null : form.decision_curve,
      curve_name:
        form.execution_mode === "custom"
          ? form.curve_name.trim()
          : null,
    };

    try {
      setSaving(true);
      await onSubmit(payload);

      showSnackbar("Strategie opgeslagen", "success");

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
          execution_mode: "fixed",
          decision_curve: null,
          curve_name: "",
          base_amount: "",
        });
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Opslaan mislukt", "danger");
      setError("❌ Opslaan mislukt.");
    } finally {
      setSaving(false);
    }
  };

  const disabled =
    saving ||
    !form.setup_id ||
    !form.entry ||
    !form.target ||
    !form.stop_loss;

  /* ===========================================================
     UI
  =========================================================== */
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 space-y-6 rounded-2xl shadow-xl border bg-white dark:bg-[#0f0f0f] border-gray-200 dark:border-gray-800"
    >
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Pencil className="w-5 h-5 text-purple-600" />
        {mode === "edit"
          ? "Handmatige strategie bewerken"
          : "Nieuwe Handmatige Strategie"}
      </h3>

      {/* Setup */}
      <select
        name="setup_id"
        value={form.setup_id}
        disabled={mode === "edit"}
        onChange={handleChange}
        className="w-full p-3 rounded-xl border"
      >
        <option value="">-- Kies een setup --</option>
        {filteredSetups.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.symbol} – {s.timeframe})
          </option>
        ))}
      </select>

      {/* Entry / Target / SL */}
      <input name="entry" type="number" value={form.entry} onChange={handleChange} placeholder="Entry prijs" className="p-3 border rounded-xl" />
      <input name="target" type="number" value={form.target} onChange={handleChange} placeholder="Target prijs" className="p-3 border rounded-xl" />
      <input name="stop_loss" type="number" value={form.stop_loss} onChange={handleChange} placeholder="Stop-loss" className="p-3 border rounded-xl" />

      {/* Position size */}
      <div>
        <label className="text-sm font-semibold flex items-center gap-2 mb-1">
          <Euro size={14} /> Bedrag per trade (€)
        </label>
        <input
          type="number"
          name="base_amount"
          value={form.base_amount}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
        />
      </div>

      {/* Execution logic */}
      <div>
        <label className="text-sm font-semibold flex items-center gap-2 mb-1">
          <Sliders size={14} /> Executie-logica
        </label>

        <select
          name="execution_mode"
          value={form.execution_mode}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
        >
          <option value="fixed">Vast bedrag</option>
          <option value="contrarian">Contrarian sizing</option>
          <option value="trend_following">Trend sizing</option>
          <option value="custom">Custom curve</option>
        </select>
      </div>

      {/* Curve naam */}
      {form.execution_mode === "custom" && (
        <input
          name="curve_name"
          value={form.curve_name}
          onChange={handleChange}
          placeholder="Curve naam"
          className="p-3 border rounded-xl"
        />
      )}

      {/* Curve editor */}
      {form.execution_mode !== "fixed" && (
        <CurveEditor
          value={form.decision_curve}
          onChange={(curve) =>
            setForm((p) => ({ ...p, decision_curve: curve }))
          }
        />
      )}

      {/* Tags */}
      <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags" className="p-3 border rounded-xl" />

      {/* Favorite */}
      <label className="flex items-center gap-2">
        <input type="checkbox" name="favorite" checked={form.favorite} onChange={handleChange} />
        {form.favorite ? <Star className="text-yellow-500" /> : <StarOff />}
        Favoriet
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!hideSubmit && (
        <button
          type="submit"
          disabled={disabled}
          className="btn-primary w-full"
        >
          {saving ? "Opslaan…" : "Strategie opslaan"}
        </button>
      )}
    </form>
  );
}
