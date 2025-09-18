'use client';

export default function TechnicalWeekTable({ data = [], onRemove }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={4} className="p-4 text-center text-gray-500">
          ⚠️ Geen technische week-data beschikbaar.
        </td>
      </tr>
    );
  }

  const item = data[0]; // ✅ Alleen BTC gebruiken
  const symbol = item?.symbol || 'BTC';

  // 🟩 Scorekleur helper
  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 2) return 'text-green-600';
    if (s <= -2) return 'text-red-600';
    return 'text-gray-600';
  };

  const rows = [
    {
      label: 'RSI',
      value: item?.rsi ?? '–',
      score: item?.rsi_score,
    },
    {
      label: 'Volume',
      value:
        typeof item?.volume === 'number'
          ? (item.volume / 1e6).toFixed(1) + 'M'
          : '–',
      score: item?.volume_score,
    },
    {
      label: '200MA',
      value:
        typeof item?.price === 'number' && typeof item?.ma_200 === 'number'
          ? item.price > item.ma_200
            ? 'Boven MA'
            : 'Onder MA'
          : '–',
      score: item?.ma_200_score,
    },
  ];

  return (
    <>
      {rows.map(({ label, value, score }) => (
        <tr key={label} className="border-t dark:border-gray-700">
          <td className="p-2 font-medium">{label}</td>
          <td className="p-2 text-center">{value}</td>
          <td className={`p-2 text-center font-bold ${getScoreColor(score)}`}>
            {score ?? '–'}
          </td>
          <td className="p-2 text-center">
            <button
              onClick={() => onRemove?.(symbol)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              ❌
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
