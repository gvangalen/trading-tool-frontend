import ReportCard from '../ReportCard';
import { Activity } from 'lucide-react';

/* =====================================================
   HELPERS – block-eigen score normalisatie
===================================================== */

function normalizeScore(value) {
  if (value === null || value === undefined) return '–';

  // string → laten staan (bijv. "N/A")
  if (typeof value === 'string') return value;

  // number → afronden
  if (typeof value === 'number') {
    return Math.round(value);
  }

  return '–';
}

function extractScores(props) {
  // 1️⃣ voorkeur: hele report meegegeven
  if (props.report && typeof props.report === 'object') {
    return {
      macro: props.report.macro_score,
      technical: props.report.technical_score,
      market: props.report.market_score,
      setup: props.report.setup_score,
    };
  }

  // 2️⃣ fallback: losse props (oude manier blijft werken)
  return {
    macro: props.macro,
    technical: props.technical,
    market: props.market,
    setup: props.setup,
  };
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
===================================================== */

export default function ScoreBarBlock(props) {
  const { macro, technical, market, setup } = extractScores(props);

  // niets renderen als alles leeg is
  if (
    macro === undefined &&
    technical === undefined &&
    market === undefined &&
    setup === undefined
  ) {
    return null;
  }

  return (
    <ReportCard
      icon={<Activity size={18} />}
      title="Scores"
      color="gray"
    >
      <div className="space-y-2">
        <ScoreItem label="Macro" value={macro} />
        <ScoreItem label="Technical" value={technical} />
        <ScoreItem label="Market" value={market} />
        <ScoreItem label="Setup" value={setup} />
      </div>
    </ReportCard>
  );
}
