"use client";

import { useEffect, useMemo, useState } from "react";
import { useModal } from "@/components/modal/ModalProvider";
import { updateStrategy } from "@/lib/api/strategy";

export default function StrategyForm({
  mode = "edit",
  initialData = {},
  onSaved,
}) {
  const { showSnackbar } = useModal();

  const strategyId = initialData?.id;

  // ----------------------------------------------------
  // NEW MODEL
  // ----------------------------------------------------
  const setupType = String(
    initialData?.setup_type ||
      initialData?.setup?.setup_type ||
      initialData?.strategy_type ||
      "unknown"
  ).toLowerCase();

  const isDcaSetup =
    setupType === "dca_basic" || setupType === "dca_smart";

  const isBreakoutSetup = setupType === "breakout";

  // oude fallback alleen voor legacy data
  const legacyStrategyType = String(
    initialData?.strategy_type || "manual"
  ).toLowerCase();

  const initialTargets = useMemo(() => {
    const t = initialData?.targets;
    if (Array.isArray(t)) return t.filter(Boolean);
    if (typeof t === "string" && t.trim()) {
      return t
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [initialData]);

  // ----------------------------------------------------
  // STATE
  // ----------------------------------------------------
  const [entry, setEntry] = useState(initialData?.entry ?? "");
  const [targetsText, setTargetsText] = useState(initialTargets.join(", "));
  const [stopLoss, setStopLoss] = useState(initialData?.stop_loss ?? "");
  const [explanation, setExplanation] = useState(initialData?.explanation ?? "");
  const [riskProfile, setRiskProfile] = useState(initialData?.risk_profile ?? "");

  // strategie velden
  const [amount, setAmount] = useState(
    initialData?.amount ??
      initialData?.amount_eur ??
      initialData?.base_amount ??
      initialData?.data?.amount ??
      initialData?.data?.amount_eur ??
      initialData?.data?.base_amount ??
      ""
  );

  const [tagsText, setTagsText] = useState(
    Array.isArray(initialData?.tags)
      ? initialData.tags.join(", ")
      : (initialData?.tags ?? "")
  );

  const [favorite, setFavorite] = useState(!!initialData?.favorite);

  // setup planning info (read-only)
  const setupFrequency =
    initialData?.dca_frequency ||
    initialData?.setup?.dca_frequency ||
    "-";

  const setupDay =
    initialData?.dca_day ||
    initialData?.setup?.dca_day ||
    "-";

  const setupMonthDay =
    initialData?.dca_month_day ||
    initialData?.setup?.dca_month_day ||
    "-";

  // ----------------------------------------------------
  // SYNC ON REOPEN
  // ----------------------------------------------------
  useEffect(() => {
    setEntry(initialData?.entry ?? "");
    setTargetsText(initialTargets.join(", "));
    setStopLoss(initialData?.stop_loss ?? "");
    setExplanation(initialData?.explanation ?? "");
    setRiskProfile(initialData?.risk_profile ?? "");

    setAmount(
      initialData?.amount ??
        initialData?.amount_eur ??
        initialData?.base_amount ??
        initialData?.data?.amount ??
        initialData?.data?.amount_eur ??
        initialData?.data?.base_amount ??
        ""
    );

    setTagsText(
      Array.isArray(initialData?.tags)
        ? initialData.tags.join(", ")
        : (initialData?.tags ?? "")
    );

    setFavorite(!!initialData?.favorite);
  }, [initialData, initialTargets]);

  // ----------------------------------------------------
  // HELPERS
  // ----------------------------------------------------
  const parseCommaList = (txt) =>
    String(txt || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const prettySetupType = (value) => {
    switch (String(value || "").toLowerCase()) {
      case "dca_basic":
        return "DCA Basic";
      case "dca_smart":
        return "DCA Smart";
      case "breakout":
        return "Breakout";
      default:
        return value || "-";
    }
  };

  const prettyFrequency = (value) => {
    switch (String(value || "").toLowerCase()) {
      case "daily":
        return "Dagelijks";
      case "weekly":
        return "Wekelijks";
      case "monthly":
        return "Maandelijks";
      default:
        return value || "-";
    }
  };

  const prettyWeekday = (value) => {
    const map = {
      monday: "Maandag",
      tuesday: "Dinsdag",
      wednesday: "Woensdag",
      thursday: "Donderdag",
      friday: "Vrijdag",
      saturday: "Zaterdag",
      sunday: "Zondag",
    };
    return map[String(value || "").toLowerCase()] || value || "-";
  };

  // ----------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------
  async function handleSubmit(e) {
    e?.preventDefault?.();

    if (!strategyId) {
      showSnackbar("Geen strategie-id gevonden.", "danger");
      return;
    }

    const updated = {
      ...initialData,
      explanation,
      risk_profile: riskProfile,
      favorite,
      tags: parseCommaList(tagsText),

      // 🔥 setup_type meesturen voor consistentie
      setup_type: setupType,
    };

    // ------------------------------------------------
    // DCA SETUPS
    // ------------------------------------------------
    if (isDcaSetup) {
      updated.amount = amount;
      updated.amount_eur = amount;

      // DCA planning blijft op setup-niveau
      delete updated.frequency;
      delete updated.entry;
      delete updated.targets;
      delete updated.stop_loss;
    }

    // ------------------------------------------------
    // BREAKOUT / NON-DCA SETUPS
    // ------------------------------------------------
    else {
      updated.entry = entry;
      updated.targets = parseCommaList(targetsText);
      updated.stop_loss = stopLoss;

      delete updated.amount;
      delete updated.amount_eur;
      delete updated.frequency;
    }

    try {
      await updateStrategy(strategyId, updated);
      showSnackbar("Strategie opgeslagen.", "success");
      onSaved && onSaved(updated);
    } catch (err) {
      console.error("❌ StrategyForm save fout:", err);
      showSnackbar("Opslaan mislukt.", "danger");
    }
  }

  // ----------------------------------------------------
  // UI STYLES
  // ----------------------------------------------------
  const fieldClass =
    "w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-950";

  const readOnlyCardClass =
    "rounded-xl border bg-[var(--bg-soft)] px-3 py-3";

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="text-sm">
          <div className="text-gray-500">Setup</div>
          <div className="font-medium">{initialData?.setup_name || "-"}</div>
        </div>

        <div className="text-sm">
          <div className="text-gray-500">Setup role</div>
          <div className="font-medium">{prettySetupType(setupType)}</div>
        </div>
      </div>

      {/* Legacy info alleen voor debug / overgang */}
      {legacyStrategyType && legacyStrategyType !== "manual" && (
        <div className="text-xs text-gray-400">
          Legacy strategy_type: {legacyStrategyType}
        </div>
      )}

      {/* BREAKOUT / NON-DCA */}
      {!isDcaSetup && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Entry</label>
            <input
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className={fieldClass}
              placeholder="bijv. 20000-21000"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Stop-loss</label>
            <input
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className={fieldClass}
              placeholder="bijv. 19000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-gray-500">
              Targets (komma gescheiden)
            </label>
            <input
              value={targetsText}
              onChange={(e) => setTargetsText(e.target.value)}
              className={fieldClass}
              placeholder="bijv. 25000, 30000, 35000"
            />
          </div>
        </div>
      )}

      {/* DCA */}
      {isDcaSetup && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Bedrag per trade</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={fieldClass}
              placeholder="bijv. 100"
            />
          </div>

          <div className={readOnlyCardClass}>
            <div className="text-xs text-gray-500 mb-2">Planning vanuit setup</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-gray-500">Frequentie</div>
                <div className="font-medium">
                  {prettyFrequency(setupFrequency)}
                </div>
              </div>

              {String(setupFrequency).toLowerCase() === "weekly" && (
                <div>
                  <div className="text-gray-500">Dag</div>
                  <div className="font-medium">
                    {prettyWeekday(setupDay)}
                  </div>
                </div>
              )}

              {String(setupFrequency).toLowerCase() === "monthly" && (
                <div>
                  <div className="text-gray-500">Dag van maand</div>
                  <div className="font-medium">{setupMonthDay}</div>
                </div>
              )}
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Planning wordt beheerd in de setup. Hier pas je alleen de strategie-inhoud aan.
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs text-gray-500">Uitleg</label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-950 min-h-[90px]"
          placeholder="Korte uitleg van de strategie…"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Risk profile</label>
          <input
            value={riskProfile}
            onChange={(e) => setRiskProfile(e.target.value)}
            className={fieldClass}
            placeholder="laag / medium / hoog"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Tags (komma)</label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className={fieldClass}
            placeholder="swing, breakout, dca"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={favorite}
          onChange={(e) => setFavorite(e.target.checked)}
        />
        Favoriet
      </label>

      {/* Hidden submit → wordt door modal confirm geklikt */}
      <button id="strategy-edit-submit" type="submit" className="hidden">
        Save
      </button>
    </form>
  );
}
