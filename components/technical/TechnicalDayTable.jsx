'use client';

export default function TechnicalDayTable({ data, getExplanation, calculateScore }) {
  return (
    <>
      {data.map((indicator) => {
        const explanation = getExplanation(indicator);
        const score = calculateScore(indicator);

        return (
          <tr key={indicator.id} className="border-b">
            <td className="p-2 font-medium">{indicator.name}</td>
            <td className="p-2">{indicator.value}</td>
            <td className="p-2 font-semibold text-center">
              {score > 0 && <span className="text-green-600">+{score}</span>}
              {score < 0 && <span className="text-red-600">{score}</span>}
              {score === 0 && <span className="text-gray-600">0</span>}
            </td>
            <td className="p-2 flex items-center gap-2">
              <span>{explanation.icon}</span>
              <span>{explanation.text}</span>
            </td>
          </tr>
        );
      })}
    </>
  );
}
