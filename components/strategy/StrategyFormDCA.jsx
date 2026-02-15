"use client";

import { useState, useEffect } from "react";
import { useSetupData } from "@/hooks/useSetupData";
import { useModal } from "@/components/modal/ModalProvider";
import { fetchAuth } from "@/lib/api/auth";

import { Wallet } from "lucide-react";
import CurveEditor from "@/components/decision/CurveEditor";

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
  const [curves, setCurves] = useState([]);

  const [form, setForm] = useState({
    setup_id: initialData?.setup_id || "",
    symbol: initialData?.symbol || "",
    timeframe: initialData?.timeframe || "",

    amount: initialData?.base_amount || "",
    frequency: initialData?.frequency || "",

    execution_mode: initialData?.execution_mode || "fixed",

    decision_curve: initialData?.decision_curve || null,
    curve_name:
      initialData?.decision_curve?.name ||
      initialData?.curve_name ||
      "",

    selected_curve_id:
      initialData?.decision_curve_id || "new",
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadSetups();
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

  /* ================= AVAILABLE SETUPS ================= */

  const availableSetups = setups.filter(
    (s) => s.strategy_type?.toLowerCase() === "dca"
  );

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "setup_id") {
      const selected = availableSetups.find(
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
        const selected = curves.find((c) => String(c.id) === value);

        setForm((p) => ({
          ...p,
          selected_curve_id: value,
          decision_curve: selected.curve,
          curve_name: selected.name,
        }));
      }
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= VALIDATION ================= */

  const isValid =
    form.setup_id &&
    Number(form.amount) > 0 &&
    form.frequency &&
    (form.execution_mode === "fixed" ||
      (form.decision_curve &&
        form.decision_curve.points?.length >= 2 &&
        form.curve_name.trim() !== ""));

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setError("❌ Vul alle velden correct in.");
      return;
    }

    const payload = {
      strategy_type: "dca",
      setup_id: Number(form.setup_id),
      base_amount: Number(form.amount),
      frequency: form.frequency,
      execution_mode: form.execution_mode,

      decision_curve:
        form.execution_mode === "fixed"
          ? null
          : {
              ...form.decision_curve,
              name: form.curve_name.trim(),
            },

      curve_name:
        form.execution_mode === "fixed"
          ? null
          : form.curve_name.trim(),

      // 🔥 belangrijk voor reuse
      decision_curve_id:
        form.selected_curve_id !== "new"
          ? Number(form.selected_curve_id)
          : null,

      selected_curve_id: form.selected_curve_id,
    };

    try {
      await onSubmit(payload);
      showSnackbar("Strategie opgeslagen", "success");
    } catch (err) {
      console.error(err);
      setError("Opslaan mislukt.");
    }
  };

  /* ================= UI ================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <h2 className="text-xl font-bold flex items-center gap-2">
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

      {/* ================= EXECUTION LOGIC ================= */}

      <div className="space-y-3">
        <label className="text-sm font-semibold">
          Execution logic
        </label>

        <label className="flex gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
          <input
            type="radio"
            name="execution_mode"
            value="fixed"
            checked={form.execution_mode === "fixed"}
            onChange={handleChange}
          />
          <div>
            <div className="font-medium">Fixed amount</div>
            <div className="text-xs text-gray-500">
              Invest the same amount every execution.
            </div>
          </div>
        </label>

        <label className="flex gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
          <input
            type="radio"
            name="execution_mode"
            value="custom"
            checked={form.execution_mode === "custom"}
            onChange={handleChange}
          />
          <div>
            <div className="font-medium">Curve-based sizing</div>
            <div className="text-xs text-gray-500">
              Adjust allocation based on market score.
            </div>
          </div>
        </label>
      </div>

      {/* ================= CURVE SECTION ================= */}

      {form.execution_mode === "custom" && (
        <>
          <select
            name="selected_curve_id"
            value={form.selected_curve_id}
            onChange={handleChange}
            className="input"
          >
            <option value="new">Nieuwe curve</option>
            {curves.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {form.selected_curve_id === "new" && (
            <>
              <input
                name="curve_name"
                value={form.curve_name}
                onChange={handleChange}
                placeholder="Naam van je curve"
                className="input"
              />

              <CurveEditor
                value={form.decision_curve}
                onChange={(curve) =>
                  setForm((p) => ({ ...p, decision_curve: curve }))
                }
              />
            </>
          )}
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!hideSubmit && (
        <button disabled={!isValid} className="btn-primary w-full">
          Opslaan
        </button>
      )}
    </form>
  );
}
