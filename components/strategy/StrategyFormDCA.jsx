"use client";

import { useState, useEffect } from "react";
import { useSetupData } from "@/hooks/useSetupData";
import { useModal } from "@/components/modal/ModalProvider";
import { Wallet, Info, Sliders, Star, StarOff } from "lucide-react";
import CurveEditor from "@/components/decision/CurveEditor";

/* ==========================================================
   Curve presets
========================================================== */
const CURVE_PRESETS = {
  fixed: null,

  dca_contrarian: {
    name: "Contrarian",
    input: "market_score",
    points: [
      { x: 20, y: 1.5 },
      { x: 40, y: 1.2 },
      { x: 60, y: 1.0 },
      { x: 80, y: 0.5 },
    ],
  },

  dca_trend_following: {
    name: "Trend Following",
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

    amount: initialData?.base_amount || "",
    frequency: initialData?.frequency || "",

    execution_mode: initialData?.execution_mode || "fixed",
    decision_curve: initialData?.decision_curve || null,

    // ⭐ curve naam automatisch laden
    curve_name:
      initialData?.decision_curve?.name ||
      initialData?.curve_name ||
      "",

    rules: initialData?.rules || "",
    favorite: initialData?.favorite || false,
    tags: initialData?.tags?.join(", ") || "",
  });

  useEffect(() => {
    loadSetups();
  }, []);

  /* ==========================================================
     Alleen DCA setups
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
      setForm((p) => ({ ...p, [name]: checked }));
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

      setForm((p) => ({
        ...p,
        setup_id: selected.id,
        setup_name: selected.name,
        symbol: selected.symbol,
        timeframe: selected.timeframe,
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
            JSON.parse(JSON.stringify(CURVE_PRESETS.dca_contrarian)),
          curve_name: "",
        }));
      } else if (value === "fixed") {
        setForm((p) => ({
          ...p,
          execution_mode: "fixed",
          decision_curve: null,
          curve_name: "",
        }));
      } else {
        const preset = CURVE_PRESETS[value];
        setForm((p) => ({
          ...p,
          execution_mode: value,
          decision_curve: preset,
          curve_name: preset?.name || "",
        }));
      }
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ==========================================================
     VALIDATIE
  ========================================================== */
  const isFormValid = () =>
    form.setup_id &&
    Number(form.amount) > 0 &&
    form.frequency &&
    (
      form.execution_mode === "fixed" ||
      (
        form.decision_curve &&
        form.decision_curve.points?.length >= 2 &&
        (form.execution_mode !== "custom" ||
          form.curve_name.trim() !== "")
      )
    );

  /* ==========================================================
     SUBMIT
  ========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError("❌ Vul alle verplichte velden correct in.");
      return;
    }

    // ⭐ curve naam in curve object injecteren
    const curveWithName =
      form.execution_mode === "fixed"
        ? null
        : {
            ...form.decision_curve,
            name: form.curve_name?.trim() || null,
          };

    const payload = {
      strategy_type: "dca",
      setup_id: form.setup_id,
      base_amount: Number(form.amount),
      frequency: form.frequency,
      execution_mode: form.execution_mode,
      decision_curve: curveWithName,
      curve_name: form.curve_name?.trim() || null,
      rules: form.rules?.trim() || "",
      favorite: !!form.favorite,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      await onSubmit(payload);
      showSnackbar("DCA-strategie opgeslagen", "success");
    } catch (err) {
      console.error(err);
      setError("Opslaan mislukt.");
    }
  };

  const valid = isFormValid();

  /* ==========================================================
     UI
  ========================================================== */
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold flex gap-2 items-center">
        <Wallet className="w-5 h-5 text-blue-600" />
        {mode === "edit" ? "DCA bewerken" : "Nieuwe DCA"}
      </h2>

      {/* Setup */}
      <select
        name="setup_id"
        value={form.setup_id}
        onChange={handleChange}
        className="input"
      >
        <option value="">-- Kies setup --</option>
        {availableSetups.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.symbol})
          </option>
        ))}
      </select>

      {/* Amount */}
      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Bedrag (€)"
        className="input"
      />

      {/* Frequency */}
      <select
        name="frequency"
        value={form.frequency}
        onChange={handleChange}
        className="input"
      >
        <option value="">Frequentie</option>
        <option value="weekly">Wekelijks</option>
        <option value="monthly">Maandelijks</option>
      </select>

      {/* Execution */}
      <select
        name="execution_mode"
        value={form.execution_mode}
        onChange={handleChange}
        className="input"
      >
        <option value="fixed">Vast bedrag</option>
        <option value="dca_contrarian">Contrarian</option>
        <option value="dca_trend_following">Trend</option>
        <option value="custom">Custom curve</option>
      </select>

      {/* Curve naam */}
      {form.execution_mode === "custom" && (
        <input
          name="curve_name"
          value={form.curve_name}
          onChange={handleChange}
          placeholder="Naam van je curve"
          className="input"
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

      {error && <p className="text-red-500">{error}</p>}

      <button disabled={!valid} className="btn-primary w-full">
        Opslaan
      </button>
    </form>
  );
}
