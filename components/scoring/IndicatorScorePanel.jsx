"use client";

import { useEffect, useState } from "react";
import IndicatorScoreEditor from "./IndicatorScoreEditor";
import { fetchAuth } from "@/lib/api/auth";

export default function IndicatorScorePanel({
  indicator,
  category,
}) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------------------
     Load indicator config
  --------------------------- */
  useEffect(() => {
    loadConfig();
  }, [indicator, category]);

  async function loadConfig() {
    setLoading(true);

    try {
      const res = await fetchAuth(
        `/api/indicator-rules?category=${category}&indicator=${indicator}`
      );

      setConfig({
        rules: res.rules || [],
        score_mode: res.score_mode || "standard",
        weight: res.weight ?? 1,
      });
    } catch (e) {
      console.error("Failed loading rules", e);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------
     Save STANDARD / CONTRARIAN
  --------------------------- */
  async function saveSettings(settings) {
    try {
      await fetchAuth(`/api/indicator-rules`, {
        method: "POST",
        body: JSON.stringify({
          indicator,
          category,
          score_mode: settings.score_mode,
          weight: settings.weight,
        }),
      });

      setConfig((prev) => ({
        ...prev,
        ...settings,
      }));

    } catch (e) {
      console.error("Save failed", e);
    }
  }

  /* ---------------------------
     Save CUSTOM RULES
  --------------------------- */
  async function saveCustomRules(rules) {
    try {
      await fetchAuth(`/api/indicator-rules`, {
        method: "POST",
        body: JSON.stringify({
          indicator,
          category,
          score_mode: "custom",
          weight: config.weight,
          rules,
        }),
      });

      setConfig((prev) => ({
        ...prev,
        rules,
        score_mode: "custom",
      }));

    } catch (e) {
      console.error("Custom save failed", e);
    }
  }

  if (loading || !config) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Laden…
      </div>
    );
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
      onSaveCustom={saveCustomRules}
    />
  );
}
