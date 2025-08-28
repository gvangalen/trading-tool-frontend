import React from 'react';

export function formatChange(change: number | null | undefined): JSX.Element | string {
  if (change === null || change === undefined) return "–";
  const color = change >= 0 ? 'text-green-600' : 'text-red-600';
  return <span className={color}>{change.toFixed(2)}%</span>;
}

export function formatNumber(num: number | string | null, isPrice = false): string {
  if (num === null || num === "N/A") return "–";
  return isPrice ? `$${Number(num).toFixed(2)}` : Number(num).toLocaleString();
}
