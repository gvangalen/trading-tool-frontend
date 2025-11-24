'use client';

import React, { useEffect, useState } from "react";
import DayTable from "@/components/ui/DayTable"; 
import { deleteMacroIndicator } from "@/lib/api/macro";
import { BarChart3 } from "lucide-react";

/**
 * MacroDayTable → Wrapper rond universele DayTable
 * Wordt overal gebruikt waar macro-dagdata nodig is
 */
export default function MacroDayTable({ data = [], onRemove }) {
  const [rows, setRows] = useState(Array.isArray(data) ? data : []);

  useEffect(() => {
    if (Array.isArray(data)) {
      setRows(data);
    } else {
      console.error("❌ Ongeldige macro dagdata ontvangen:", data);
      setRows([]);
    }
  }, [data]);

  async function handleRemove(name) {
    if (!name) return;

    const ok = window.confirm(`Weet je zeker dat je '${name}' wilt verwijderen?`);
    if (!ok) return;

    try {
      await deleteMacroIndicator(name);

      // frontend update
      const updated = rows.filter((r) => r.name !== name && r.indicator !== name);
      setRows(updated);

      if (onRemove) onRemove(name);
    } catch (err) {
      console.error("❌ Verwijderen mislukt:", err);
      window.alert("Verwijderen is mislukt.");
    }
  }

  return (
    <DayTable
      title="Dagelijkse Macro Analyse"
      icon={<BarChart3 className="w-4 h-4" />}
      data={rows}
      onRemove={handleRemove}
    />
  );
}
