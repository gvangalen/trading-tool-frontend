"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Star,
  StarOff,
  TrendingUp,
  Sliders,
  Euro,
} from "lucide-react";

import { useModal } from "@/components/modal/ModalProvider";
import { fetchAuth } from "@/lib/api/auth";
import CurveEditor from "@/components/decision/CurveEditor";

export default function StrategyFormTrading({
  setups = [],
  onSubmit,
  mode = "create",
  initialData = null,
  hideSubmit = false,
}) {
  const { showSnackbar } = useModal();

  const [curves, setCurves] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD CURVES ================= */

  useEffect(() => {
    loadCurves();
  }, []);

  async function loadCurves() {
    try {
      const res = await fetchAuth("/api/curves/execution");
      setCurves(res || []);
    } catch (e) {
      console.error("Failed to load curves", e);
    }
  }

  /* ================= FORM STATE ================= */

  const [form, setForm] = useState({
    // ⭐ REQUIRED NAME
    name: initialData?.name || "",

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
    tags: initialData?.tags?.join(", ") || "",

    base_amount: initialData?.base_amount || "",

    execution_mode: initialData?.execution_mode || "fixed",
    decision_curve: initialData?.decision_curve || null,

    curve_name:
      initialData?.decision_curve_name ||
      initialData?.decision_curve?.name ||
      "",

    selected_curve_id:
      initialData?.decision_curve_id || "new",
  });

  /* ================= FILTER SETUPS ================= */

  const availableSetups = useMemo(
    () =>
      Array.isArray(setups)
        ? setups.filter(
            (s) => String(s.strategy_type).toLowerCase() === "trading"
          )
        : [],
    [setups]
  );

  /* ================= CHANGE HANDLER ================= */

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
      if (val === "fixed") {
        setForm((p) => ({
          ...p,
          execution_mode: "fixed",
          decision_curve: null,
          curve_name: "",
          selected_curve_id: "",
        }));
      } else {
        setForm((p) => ({
          ...p,
          execution_mode: "custom",
          selected_curve_id: "new",
        }));
      }
      return;
    }

    if (name === "selected_curve_id") {
      if (val === "new") {
        setForm((p) => ({
          ...p,
          selected_curve_id: "new",
          decision_curve: null,
          curve_name: "",
        }));
      } else {
        const selected = curves.find((c) => String(c.id) === val);

        setForm((p) => ({
          ...p,
          selected_curve_id: val,
          decision_curve: selected.curve,
          curve_name: selected.name ?? "",
        }));
      }
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim())
      return setError("❌ Strategie naam is verplicht.");

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
      name: form.name.trim(), // ⭐ REQUIRED

      setup_id: Number(form.setup_id),
      entry,
      targets,
      stop_loss,
      explanation: form.explanation.trim(),
      favorite: form.favorite,
      tags,

      execution_mode: form.execution_mode,
      base_amount: Number(form.base_amount),

      decision_curve:
        form.execution_mode === "fixed"
          ? null
          : {
              ...form.decision_curve,
              name: form.curve_name.trim(),
            },

      decision_curve_name:
        form.execution_mode === "fixed"
          ? null
          : form.curve_name.trim(),

      decision_curve_id:
        form.selected_curve_id !== "new"
          ? Number(form.selected_curve_id)
          : null,
    };

    try {
      setSaving(true);
      await onSubmit(payload);
      showSnackbar("Strategie succesvol opgeslagen", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Opslaan mislukt", "danger");
    } finally {
      setSaving(false);
    }
  };

  const disabled =
    saving ||
    !form.name.trim() ||
    !form.setup_id ||
    !form.entry ||
    !form.targetsText ||
    !form.stop_loss;

  /* ================= UI ================= */

  return (
    <form className="w-full max-w-2xl mx-auto p-6 space-y-6 rounded-2xl shadow-xl border bg-white dark:bg-[#0f0f0f]">

      <h3 className="text-xl font-bold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        {mode === "edit"
          ? "Tradingstrategie bewerken"
          : "Nieuwe Tradingstrategie"}
      </h3>

      {/* ⭐ STRATEGY NAME */}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Strategie naam"
        className="input"
      />

      <select
        name="setup_id"
        value={form.setup_id}
        disabled={mode === "edit"}
        onChange={handleChange}
        className="input"
      >
        <option value="">-- Kies een setup --</option>
        {availableSetups.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.symbol})
          </option>
        ))}
      </select>

      <input name="entry" type="number" value={form.entry} onChange={handleChange} placeholder="Entry" className="input"/>
      <input name="targetsText" value={form.targetsText} onChange={handleChange} placeholder="Targets (comma)" className="input"/>
      <input name="stop_loss" type="number" value={form.stop_loss} onChange={handleChange} placeholder="Stop loss" className="input"/>

      <div>
        <label className="text-sm font-semibold flex gap-2 items-center mb-1">
          <Euro size={14}/> Bedrag per trade
        </label>
        <input type="number" name="base_amount" value={form.base_amount} onChange={handleChange} className="input"/>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!hideSubmit && (
        <button type="submit" disabled={disabled} className="btn-primary w-full">
          {saving ? "Opslaan…" : "Strategie opslaan"}
        </button>
      )}
    </form>
  );
}
