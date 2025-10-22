'use client';

export default function MacroWeekTable({
  data,
  getExplanation,
}) {
  return data.map((item) => {
    const score = parseFloat(item.score);
    const scoreColor =
      score >= 75 ? 'text-green-600'
      : score <= 25 ? 'text-red-600'
      : 'text-gray-600';

    return (
      <tr key={item.name} className="border-t dark:border-gray-700">
        {/* 📌 Naam met hover-uitleg */}
        <td className="p-2 font-medium" title={getExplanation?.(item.name)}>
          {item.name}
        </td>

        {/* 📌 Waarde placeholder */}
        <td className="p-2 text-gray-500">Gem. weekwaarde</td>

        {/* 📌 Trend */}
        <td className="p-2 italic text-gray-500">{item.trend?.trim() || '–'}</td>

        {/* 📌 Interpretatie */}
        <td className="p-2 italic text-gray-500">{item.interpretation?.trim() || '–'}</td>

        {/* 📌 Actie */}
        <td className="p-2 italic text-gray-500">{item.action?.trim() || '–'}</td>

        {/* 📌 Score */}
        <td className={`p-2 font-bold ${scoreColor}`}>
          {isNaN(score) ? '–' : score}
        </td>

        {/* 📌 Verwijderkolom of placeholder */}
        <td className="p-2 text-center text-gray-400">–</td>
      </tr>
    );
  });
}
