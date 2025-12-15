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

  const strategyType = String(initialData?.strategy_type || "manual").toLowerCase();
  const isDCA = strategyType === "dca";

  const initialTargets = useMemo(() => {
    const t = initialData?.targets;
    if (Array.isArray(t)) return t.filter(Boolean);
    if (typeof t === "string" && t.trim()) return t.split(",").map(s => s.trim()).filter(Boolean);
    return [];
  }, [initialData]);

  const [entry, setEntry] = useState(initialData?.entry ?? "");
  const [targetsText, setTargetsText] = useState(initialTargets.join(", "));
  const [stopLoss, setStopLoss] = useState(initialData?.stop_loss ?? "");
  const [explanation, setExplanation] = useState(initialData?.explanation ?? "");
  const [riskProfile, setRiskProfile] = useState(initialData?.risk_profile ?? "");

  // DCA velden (als aanwezig)
  const [amount, setAmount] = useState(initialData?.amount ?? initialData?.data?.amount ?? "");
  const [frequency, setFrequency] = useState(initialData?.frequency ?? initialData?.data?.frequency ?? "");

  // tags/favorite (optioneel)
  const [tagsText, setTagsText] = useState(
    Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : (initialData?.tags ?? "")
  );
  const [favorite, setFavorite] = useState(!!initialData?.favorite);

  // keep in sync als modal heropent met andere initialData
  useEffect(() => {
    setEntry(initialData?.entry ?? "");
    setTargetsText(initialTargets.join(", "));
    setStopLoss(initialData?.stop_loss ?? "");
    setExplanation(initialData?.explanation ?? "");
    setRiskProfile(initialData?.risk_profile ?? "");

    setAmount(initialData?.amount ?? initialData?.data?.amount ?? "");
    setFrequency(initialData?.frequency ?? initialData?.data?.frequency ?? "");

    setTagsText(Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : (initialData?.tags ?? ""));
    setFavorite(!!initialData?.favorite);
  }, [initialData, initialTargets]);

  const parseTargets = (txt) =>
    String(txt || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  async function handleSubmit(e) {
    e?.preventDefault?.();

    if (!strategyId) {
      showSnackbar("Geen strategie-id gevonden.", "danger");
      return;
    }

    // Bouw de payload zoals jouw backend verwacht: data = volledige strategie JSON
    const updated = {
      ...initialData,
      entry: isDCA ? (initialData?.entry ?? "") : entry,
      targets: isDCA ? (initialData?.targets ?? []) : parseTargets(targetsText),
      stop_loss: isDCA ? (initialData?.stop_loss ?? "") : stopLoss,
      explanation,
      risk_profile: riskProfile,
      favorite,
      tags: parseTargets(tagsText),

      // DCA velden
      amount: isDCA ? amount : (initialData?.amount ?? undefined),
      frequency: isDCA ? frequency : (initialData?.frequency ?? undefined),
    };

    try {
      await updateStrategy(strategyId, updated);
      showSnackbar("Strategie opgeslagen.", "success");
      onSaved && onSaved(updated);
    } catch (err) {
      console.error("❌ StrategyForm save fout:", err);
      showSnackbar("Opslaan mislukt.", "danger");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alleen info velden (read-only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="text-sm">
          <div className="text-gray-500">Setup</div>
          <div className="font-medium">{initialData?.setup_name || "-"}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-500">Type</div>
          <div className="font-medium">{strategyType}</div>
        </div>
      </div>

      {/* TRADING / MANUAL */}
      {!isDCA && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Entry</label>
            <input
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-950"
              placeholder="bijv. 20000-21000"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Stop-loss</label>
            <input
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-950"
              placeholder="bijv. 19000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-gray-500">Targets (komma gescheiden)</label>
            <input
              value={targetsText}
              onChange={(e) => setTargetsText(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-950"
              placeholder="bijv. 25000, 30000, 35000"
            />
          </div>
        </div>
      )}

      {/* DCA */}
      {isDCA && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-950"
              placeholder="bijv. 100"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Frequency</label>
            <input
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-950"
              placeholder="bijv. weekly / monthly"
            />
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
            className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-950"
            placeholder="laag / medium / hoog"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Tags (komma)</label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-950"
            placeholder="swing, scalp, dca"
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
