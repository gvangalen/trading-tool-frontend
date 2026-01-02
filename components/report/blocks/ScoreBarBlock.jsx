import ReportCard from "../ReportCard";
import { Activity } from "lucide-react";

/* =====================================================
   HELPERS – exact oud report gedrag
===================================================== */

function normalizeScore(value) {
  if (value === null || value === undefined) return "–";

  if (typeof value === "number") {
    return Math.round(value);
  }

  if (typeof value === "string") {
    return value;
  }

  return "–";
}

/* =====================================================
   UI SUBCOMPONENT
===================================================== */

function ScoreItem({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--text-light)]">{label}</span>
      <span className="font-semibold">{normalizeScore(value)}</span>
    </div>
  );
}

/* =====================================================
   BLOCK
   - UI via children
   - Data komt 1-op-1 uit report (DB)
===================================================== */

export default function ScoreBarBlock({ report }) {
  if (!report || typeof report !== "object") return null;

  const {
    macro_score,
    technical_score,
    market_score,
    setup_score,
  } = report;

  // 🔒 niets renderen als ALLES ontbreekt
  if (
    macro_score === undefined &&
    technical_score === undefined &&
    market_score === undefined &&
    setup_score === undefined
  ) {
    return null;
  }

  return (
    <ReportCard
      icon={<Activity size={18} />}
      title="Scores"
      color="gray"
    >
      {/* 👇 UI → children (NOOIT via content) */}
      <div className="space-y-2">
        <ScoreItem label="Macro" value={macro_score} />
        <ScoreItem label="Technical" value={technical_score} />
        <ScoreItem label="Market" value={market_score} />
        <ScoreItem label="Setup" value={setup_score} />
      </div>
    </ReportCard>
  );
}
