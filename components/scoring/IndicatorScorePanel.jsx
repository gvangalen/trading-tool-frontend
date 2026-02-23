"use client";

import { useEffect, useState, useCallback } from "react";
import IndicatorScoreEditor from "./IndicatorScoreEditor";

import {
  getIndicatorConfig,
  updateIndicatorSettings,
  saveCustomRules as apiSaveCustomRules,
} from "@/lib/api/indicatorConfig";

import { useModal } from "@/components/modal/ModalProvider";

/**
 * IndicatorScorePanel — gebruikt globale snackbar uit ModalProvider
 *
 * ✅ Load config (rules + score_mode + weight)
 * ✅ Standard/Contrarian: updateIndicatorSettings + snackbar
 * ✅ Custom:
 *    1) updateIndicatorSettings (mode=custom + weight)
 *    2) saveCustomRules (5 bucket rules)
 *    3) reload config
 *    + snackbar
 */

export default function IndicatorScorePanel({ indicator, category }) {
  const { showSnackbar } = useModal();

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadConfig = useCallback(async () => {
    if (!indicator || !category) return;

    setLoading(true);
    try {
      const res = await getIndicatorConfig(category, indicator);

      setConfig({
        rules: res?.rules || [],
        score_mode: res?.score_mode || "standard",
        weight: res?.weight ?? 1,
      });
    } catch (e) {
      console.error("Failed loading config", e);
      showSnackbar("Laden mislukt ❌", "danger");
    } finally {
      setLoading(false);
    }
  }, [indicator, category, showSnackbar]);

  /* ---------------------------
     Load indicator config
  --------------------------- */
  useEffect(() => {
    if (!indicator || !category) return;
    loadConfig();
  }, [indicator, category, loadConfig]);

  /* ---------------------------
     Save STANDARD / CONTRARIAN
     (Editor autosave bij mode-switch)
  --------------------------- */
  const saveSettings = useCallback(
    async (settings) => {
      try {
        await updateIndicatorSettings({
          category,
          indicator,
          score_mode: settings?.score_mode,
          weight: settings?.weight ?? 1,
        });

        // refresh from API (single source of truth)
        await loadConfig();

        showSnackbar("Instellingen opgeslagen ✅", "success");
      } catch (e) {
        console.error("Save failed", e);
        showSnackbar("Opslaan mislukt ❌", "danger");
      }
    },
    [category, indicator, loadConfig, showSnackbar]
  );

  /* ---------------------------
     Save CUSTOM RULES
     Let op: Editor doet eerst onSave(mode+weight), daarna onSaveCustom(rules)
     Maar we supporten hier óók direct custom-save in 1 flow (veilig).
  --------------------------- */
  const saveCustom = useCallback(
    async (payloadRules) => {
      try {
        // 1) Save rules
        await apiSaveCustomRules({
          category,
          indicator,
          rules: Array.isArray(payloadRules) ? payloadRules : [],
        });

        // 2) Reload
        await loadConfig();

        showSnackbar("Custom rules opgeslagen ✅", "success");
      } catch (e) {
        console.error("Custom save failed", e);
        showSnackbar("Custom opslaan mislukt ❌", "danger");
      }
    },
    [category, indicator, loadConfig, showSnackbar]
  );

  if (loading || !config) {
    return <div className="p-6 text-sm text-[var(--text-light)]">Laden…</div>;
  }

  return (
    <IndicatorScoreEditor
      indicator={indicator}
      category={category}
      rules={config.rules}
      scoreMode={config.score_mode}
      weight={config.weight}
      loading={loading}
      onSave={saveSettings}
      onSaveCustom={saveCustom}
    />
  );
}
