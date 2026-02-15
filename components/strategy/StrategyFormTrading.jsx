"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Star,
  StarOff,
  Tag,
  Target,
  TrendingUp,
  Sliders,
  Euro,
} from "lucide-react";

import { useModal } from "@/components/modal/ModalProvider";
import CurveEditor from "@/components/decision/CurveEditor";

/* ==========================================================
   Curve presets
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

    // ⭐ NIEUW
    execution_mode: initialData?.execution_mode || "fixed",
    decision_curve: initialData?.decision_curve || null,
    curve_name: initialData?.curve_name || "",
    base_amount: initialData?.base_amount || "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* ===========================================================
     FILTER setups
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
     INITIAL DATA
  =========================================================== */
  useEffect(() => {
    if (!initialData) return;

    setForm((prev) => ({
      ...prev,
      ...initialData,
      targetsText: Array.isArray(initialData.targets)
        ? initialData.targets.join(", ")
        : "",
    }));
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

    if (name === "execution_mode") {
      if (val === "custom") {
        setForm((p) => ({
          ...p,
          execution_mode: "custom",
          decision_curve:
            p.decision_curve ??
            JSON.parse(JSON.stringify(CURVE_PRESETS.contrarian)),
        }));
      } else if (val === "fixed") {
        setForm((p) => ({
          ...p,
          execution_mode: "fixed",
          decision_curve: null,
          curve_name: "",
        }));
      } else {
        setForm((p) => ({
          ...p,
          execution_mode: val,
          decision_curve: CURVE_PRESETS[val],
          curve_name: "",
        }));
      }
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
          execution_mode: "fixed",
          decision_curve: null,
          curve_name: "",
          base_amount: "",
        });
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Opslaan mislukt", "danger");
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
    <form className="w-full max-w-2xl mx-auto p-6 space-y-6 rounded-2xl shadow-xl border bg-white dark:bg-[#0f0f0f]">

      <h3 className="text-xl font-bold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        {mode === "edit"
          ? "Tradingstrategie bewerken"
          : "Nieuwe Tradingstrategie"}
      </h3>

      <select
        name="setup_id"
        value={form.setup_id}
        disabled={mode === "edit"}
        onChange={handleChange}
        className="w-full p-3 rounded-xl border"
      >
        <option value="">-- Kies een setup --</option>
        {availableSetups.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.symbol} – {s.timeframe})
          </option>
        ))}
      </select>

      <input name="entry" type="number" value={form.entry} onChange={handleChange} placeholder="Entry" className="p-3 border rounded-xl"/>
      <input name="targetsText" value={form.targetsText} onChange={handleChange} placeholder="Targets" className="p-3 border rounded-xl"/>
      <input name="stop_loss" type="number" value={form.stop_loss} onChange={handleChange} placeholder="Stop loss" className="p-3 border rounded-xl"/>

      {/* Position sizing */}
      <div>
        <label className="text-sm font-semibold flex items-center gap-2 mb-1">
          <Euro size={14}/> Bedrag per trade
        </label>
        <input type="number" name="base_amount" value={form.base_amount} onChange={handleChange} className="w-full p-3 border rounded-xl"/>
      </div>

      {/* Execution logic */}
      <div>
        <label className="text-sm font-semibold flex items-center gap-2 mb-1">
          <Sliders size={14}/> Executie logica
        </label>

        <select name="execution_mode" value={form.execution_mode} onChange={handleChange} className="w-full p-3 border rounded-xl">
          <option value="fixed">Vast bedrag</option>
          <option value="contrarian">Contrarian sizing</option>
          <option value="trend_following">Trend sizing</option>
          <option value="custom">Custom curve</option>
        </select>
      </div>

      {form.execution_mode === "custom" && (
        <input name="curve_name" value={form.curve_name} onChange={handleChange} placeholder="Curve naam" className="p-3 border rounded-xl"/>
      )}

      {form.execution_mode !== "fixed" && (
        <CurveEditor
          value={form.decision_curve}
          onChange={(curve) =>
            setForm((p) => ({ ...p, decision_curve: curve }))
          }
        />
      )}

      <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags" className="p-3 border rounded-xl"/>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="favorite" checked={form.favorite} onChange={handleChange}/>
        {form.favorite ? <Star className="text-yellow-500"/> : <StarOff/>}
        Favoriet
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!hideSubmit && (
        <button type="submit" disabled={disabled} className="btn-primary w-full">
          {saving ? "Opslaan…" : "Strategie opslaan"}
        </button>
      )}
    </form>
  );
}
