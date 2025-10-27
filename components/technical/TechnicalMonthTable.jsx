'use client';

export default function TechnicalMonthTable({ data = [], onRemove }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          ⚠️ Geen maandelijkse technische data beschikbaar.
        </td>
      </tr>
    );
  }

  const getScoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 70) return 'text-green-600';
    if (s <= 40) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <>
      {data.map((item, index) => (
        <tr key={item.symbol || `${item.indicator}-${index}`} className="border-t dark:border-gray-700">
          <td className="p-2 font-medium">{item.indicator ?? '–'}</td>
          <td className="p-2 text-center">{item.value ?? '–'}</td>
          <td className={`p-2 text-center font-bold ${getScoreColor(item.score)}`}>
            {item.score ?? '–'}
          </td>
          <td className="p-2 text-center">{item.advies ?? '–'}</td>
          <td className="p-2">{item.uitleg ?? item.explanation ?? '–'}</td>
          <td className="p-2 text-center">
            <button
              onClick={() => onRemove?.(item.symbol || item.indicator)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              title="Verwijder indicator"
            >
              ❌
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
