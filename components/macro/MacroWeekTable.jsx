'use client';

export default function MacroWeekTable({
  data,
  calculateScore,
  getExplanation,
}) {
  return data.map((item) => {
    const score = calculateScore?.(item.name, parseFloat(item.value));
    const scoreColor =
      score >= 2 ? 'text-green-600'
      : score <= -2 ? 'text-red-600'
      : 'text-gray-600';

    return (
      <tr key={item.name} className="border-t dark:border-gray-700">
        <td className="p-2 font-medium" title={getExplanation?.(item.name)}>
          {item.name}
        </td>
        <td className="p-2 text-gray-500">Gem. weekwaarde</td>
        <td className="p-2 italic text-gray-500">{item.trend?.trim() || '–'}</td>
        <td className="p-2 italic text-gray-500">{item.interpretation?.trim() || '–'}</td>
        <td className="p-2 italic text-gray-500">{item.action?.trim() || '–'}</td>
        <td className={`p-2 font-bold ${scoreColor}`}>{score ?? '–'}</td>
        <td className="p-2 text-center text-gray-400">–</td>
      </tr>
    );
  });
}
