"use client";

import { useState, useEffect, useMemo } from "react";
import { useModal } from "@/components/modal/ModalProvider";
import { fetchAuth } from "@/lib/api/auth";

import { Wallet, TrendingUp } from "lucide-react";
import CurveEditor from "@/components/decision/CurveEditor";

export default function StrategyForm({
  onSubmit,
  setups = [],
  initialData = null,
  mode = "create",
  hideSubmit = false,
}) {
  const { showSnackbar } = useModal();

  const [error, setError] = useState("");
  const [curves, setCurves] = useState([]);

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
    name: initialData?.name || "",

    setup_id: initialData?.setup_id || "",
    symbol: initialData?.symbol || "",
    timeframe: initialData?.timeframe || "",

    entry: initialData?.entry || "",
    targetsText: Array.isArray(initialData?.targets)
      ? initialData.targets.join(", ")
      : "",
    stop_loss: initialData?.stop_loss || "",

    base_amount:
      initialData?.base_amount ||
      initialData?.amount ||
      "",

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

  const availableSetups = useMemo(() => {
    return setups.filter((s) => {
      const type = String(s.setup_type || "").toLowerCase();
      return type === "dca" || type === "trade";
    });
  }, [setups]);

  /* ================= SELECTED SETUP ================= */

  const selectedSetup = useMemo(() => {
    return availableSetups.find(
      (s) => String(s.id) === String(form.setup_id)
    );
  }, [form.setup_id, availableSetups]);

  const setupType = String(
    selectedSetup?.setup_type ||
    initialData?.setup_type ||
    initialData?.setup?.setup_type ||
    ""
  ).toLowerCase();
  
  const isDca = setupType === "dca";
  const isTrade = setupType === "trade";

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

    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= VALIDATION ================= */

  const isValid =
    form.name.trim() !== "" &&
    form.setup_id &&
    setupType !== "" &&
    Number(form.base_amount) > 0 &&
    (
      form.execution_mode === "fixed" ||
      (form.decision_curve &&
        form.decision_curve.points?.length >= 2 &&
        form.curve_name.trim() !== "")
    ) &&
    (
      isDca ||
      (
        isTrade &&
        form.entry &&
        form.targetsText &&
        form.stop_loss
      )
    );
  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setError("❌ Vul alle velden correct in.");
      return;
    }

    const targets = form.targetsText
      .split(",")
      .map((t) => parseFloat(t.trim()))
      .filter((n) => !Number.isNaN(n));

    const payload = {
      name: form.name.trim(),
      setup_id: Number(form.setup_id),

      base_amount: Number(form.base_amount),
      execution_mode: form.execution_mode,

      // 🔥 belangrijk voor backend consistency
      setup_type: setupType,

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

    // Trade velden
    if (isTrade) {
      payload.entry = Number(form.entry);
      payload.targets = targets;
      payload.stop_loss = Number(form.stop_loss);
    }

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
        {isDca ? (
          <Wallet className="w-5 h-5 text-blue-600" />
        ) : (
          <TrendingUp className="w-5 h-5 text-blue-600" />
        )}
        Nieuwe Strategie
      </h2>

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
        {availableSetups.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.symbol})
          </option>
        ))}
      </select>

      {/* BREAKOUT */}
      {isTrade && (
        <>
          <input
            name="entry"
            type="number"
            value={form.entry}
            onChange={handleChange}
            placeholder="Entry"
            className="input"
          />
          <input
            name="targetsText"
            value={form.targetsText}
            onChange={handleChange}
            placeholder="Targets (comma)"
            className="input"
          />
          <input
            name="stop_loss"
            type="number"
            value={form.stop_loss}
            onChange={handleChange}
            placeholder="Stop loss"
            className="input"
          />
        </>
      )}

      {/* AMOUNT */}
      <input
        type="number"
        name="base_amount"
        value={form.base_amount}
        onChange={handleChange}
        placeholder="Bedrag (€)"
        className="input"
      />

      {/* EXECUTION LOGIC */}
      <div className="space-y-3">
        <label className="text-sm font-semibold">Execution logic</label>

        <label className="flex gap-3 p-3 border rounded-xl cursor-pointer">
          <input
            type="radio"
            name="execution_mode"
            value="fixed"
            checked={form.execution_mode === "fixed"}
            onChange={handleChange}
          />
          <div>Fixed amount</div>
        </label>

        <label className="flex gap-3 p-3 border rounded-xl cursor-pointer">
          <input
            type="radio"
            name="execution_mode"
            value="custom"
            checked={form.execution_mode === "custom"}
            onChange={handleChange}
          />
          <div>Curve-based sizing</div>
        </label>
      </div>

      {/* CURVE */}
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
                placeholder="Naam curve"
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
