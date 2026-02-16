"use client";

import { useState, useEffect, useMemo } from "react";
import { useModal } from "@/components/modal/ModalProvider";
import { fetchAuth } from "@/lib/api/auth";
import CurveEditor from "@/components/decision/CurveEditor";

import {
  Pencil,
  Star,
  StarOff,
  Sliders,
  Euro,
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
    // ⭐ STRATEGY NAME (REQUIRED)
    name: initialData?.name || "",

    setup_id: initialData?.setup_id || "",
    symbol: initialData?.symbol || "",
    timeframe: initialData?.timeframe || "",
    entry: initialData?.entry || "",
    target: initialData?.targets?.[0] || "",
    stop_loss: initialData?.stop_loss || "",
    explanation: initialData?.explanation || "",
    tags: initialData?.tags?.join(", ") || "",
    favorite: initialData?.favorite || false,

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

  const filteredSetups = useMemo(() => {
    return setups.filter((s) => {
      if (s.strategy_type?.toLowerCase() !== "manual") return false;

      const exists = strategies.some(
        (st) =>
          String(st.setup_id) === String(s.id) &&
          st.strategy_type === "manual"
      );

      if (mode === "edit" && s.id === initialData?.setup_id) return true;

      return !exists;
    });
  }, [setups, strategies, mode, initialData]);

  /* ================= CHANGE HANDLER ================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "setup_id") {
      const selected = filteredSetups.find(
        (s) => String(s.id) === value
      );

      setForm((p) => ({
        ...p,
        setup_id: value,
        symbol: selected?.symbol || "",
        timeframe: selected?.timeframe || "",
      }));
      return;
    }

    if (name === "execution_mode") {
      if (value === "fixed") {
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
      if (value === "new") {
        setForm((p) => ({
          ...p,
          selected_curve_id: "new",
          decision_curve: null,
          curve_name: "",
        }));
      } else {
        const selected = curves.find(
          (c) => String(c.id) === value
        );

        setForm((p) => ({
          ...p,
          selected_curve_id: value,
          decision_curve: selected.curve,
          curve_name: selected.name ?? "",
        }));
      }
      return;
    }

    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  /* ================= VALIDATION ================= */

  const isValid =
    form.name.trim() !== "" && // ⭐ REQUIRED
    form.setup_id &&
    form.entry &&
    form.target &&
    form.stop_loss;

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("⚠️ Strategie naam is verplicht.");
      return;
    }

    if (!form.setup_id) {
      setError("⚠️ Kies een setup.");
      return;
    }

    const entry = parseFloat(form.entry);
    const target = parseFloat(form.target);
    const stop_loss = parseFloat(form.stop_loss);

    if ([entry, target, stop_loss].some(isNaN)) {
      setError("⚠️ Ongeldige prijswaarden.");
      return;
    }

    const tags =
      form.tags?.split(",").map((t) => t.trim()).filter(Boolean) || [];

    const payload = {
      name: form.name.trim(), // ⭐ REQUIRED

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
      base_amount: Number(form.base_amount),

      execution_mode: form.execution_mode,

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
      showSnackbar("Strategie opgeslagen", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Opslaan mislukt", "danger");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Pencil className="w-5 h-5 text-purple-600" />
        {mode === "edit"
          ? "Handmatige strategie bewerken"
          : "Nieuwe Handmatige Strategie"}
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
        onChange={handleChange}
        className="input"
      >
        <option value="">-- Kies setup --</option>
        {filteredSetups.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.symbol})
          </option>
        ))}
      </select>

      <input name="entry" type="number" value={form.entry} onChange={handleChange} placeholder="Entry" className="input"/>
      <input name="target" type="number" value={form.target} onChange={handleChange} placeholder="Target" className="input"/>
      <input name="stop_loss" type="number" value={form.stop_loss} onChange={handleChange} placeholder="Stop loss" className="input"/>

      <div>
        <label className="text-sm font-semibold flex gap-2 items-center mb-1">
          <Euro size={14}/> Bedrag per trade
        </label>
        <input name="base_amount" type="number" value={form.base_amount} onChange={handleChange} className="input"/>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {!hideSubmit && (
        <button disabled={!isValid || saving} className="btn-primary w-full">
          {saving ? "Opslaan…" : "Strategie opslaan"}
        </button>
      )}
    </form>
  );
}
