// components/ui/scoreUtils.js

export function getScoreBarClass(score) {
  if (score >= 70) return "score-bar score-bar-strong-buy";
  if (score >= 55) return "score-bar score-bar-buy";
  if (score >= 40) return "score-bar score-bar-neutral";
  if (score >= 25) return "score-bar score-bar-sell";
  return "score-bar score-bar-strong-sell";
}
