'use client';

export default function TechnicalDayTable({ data = [], getExplanation, calculateScore }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={4} className="p-4 text-center text-gray-500">
          Geen technische data beschikbaar.
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((indicator) => {
        const explanation = getExplanation?.(indicator.name) || 'Geen uitleg beschikbaar';
        const score = calculateScore?.(indicator) ?? 0;
        const key = indicator.id || `${indicator.name}-${indicator.value}`;

        return (
          <tr key={key} className="border-b">
            <td className="p-2 font-medium">{indicator.name}</td>
            <td className="p-2">{indicator.value}</td>
            <td className="p-2 font-semibold text-center">
              {score > 0 && <span className="text-green-600">+{score}</span>}
              {score < 0 && <span className="text-red-600">{score}</span>}
              {score === 0 && <span className="text-gray-600">0</span>}
            </td>
            <td className="p-2">{explanation}</td>
          </tr>
        );
      })}
    </>
  );
}
