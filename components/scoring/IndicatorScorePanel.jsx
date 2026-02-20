"use client";

import { useEffect, useState } from "react";
import IndicatorScoreEditor from "./IndicatorScoreEditor";
import { fetchAuth } from "@/lib/api/auth";

export default function IndicatorScorePanel({
  indicator,
  category,
}) {
  const [rules, setRules] = useState([]);
  const [scoreMode, setScoreMode] = useState("standard");
  const [weight, setWeight] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRules();
  }, [indicator]);

  async function loadRules() {
    try {
      const res = await fetchAuth(
        `/api/indicator-rules?category=${category}&indicator=${indicator}`
      );

      setRules(res.rules || []);
      setScoreMode(res.score_mode || "standard");
      setWeight(res.weight ?? 1);
    } catch (e) {
      console.error("Failed loading rules", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleChange(payload) {
    setScoreMode(payload.score_mode);
    setWeight(payload.weight);

    if (payload.rules) {
      setRules(payload.rules);
    }
  }

  async function save() {
    setSaving(true);

    try {
      await fetchAuth(`/api/indicator-rules`, {
        method: "POST",
        body: JSON.stringify({
          indicator,
          category,
          score_mode: scoreMode,
          weight,
          rules,
        }),
      });
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div className="space-y-4">

      <IndicatorScoreEditor
        indicator={indicator}
        category={category}
        rules={rules}
        scoreMode={scoreMode}
        weight={weight}
        onChange={handleChange}
      />

      <button
        onClick={save}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        {saving ? "Opslaan..." : "Opslaan"}
      </button>
    </div>
  );
}
