"use client";

export default function ScoreModeBadge({ mode }) {
  const styles = {
    standard: "bg-gray-200 text-gray-700",
    contrarian: "bg-yellow-200 text-yellow-800",
    custom: "bg-blue-200 text-blue-800",
  };

  const labels = {
    standard: "Standard",
    contrarian: "Contrarian",
    custom: "Custom",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-md font-medium ${styles[mode]}`}
    >
      {labels[mode]}
    </span>
  );
}
