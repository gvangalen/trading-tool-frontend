'use client';

export default function MacroDayTable({
  data,
  getExplanation,
  onEdit,
  onRemove,
}) {
  return data.map((item) => {
    const score = parseFloat(item.score);
    const scoreColor =
      score >= 75 ? 'text-green-600'
      : score <= 25 ? 'text-red-600'
      : 'text-gray-600';

    return (
      <tr key={item.name} className="border-t dark:border-gray-700">
        {/* 📌 Naam met uitleg bij hover */}
        <td className="p-2 font-medium" title={getExplanation(item.name)}>
          {item.name}
        </td>

        {/* 📌 Waarde als tekst */}
        <td className="p-2">{item.value}</td>

        {/* 📌 Trend */}
        <td className="p-2 italic text-gray-500">{item.trend ?? '–'}</td>

        {/* 📌 Interpretatie */}
        <td className="p-2 italic text-gray-500" title={item.interpretation}>
          {item.interpretation ?? '–'}
        </td>

        {/* 📌 Actie */}
        <td className="p-2 italic text-gray-500">{item.action ?? '–'}</td>

        {/* 📌 Score */}
        <td className={`p-2 font-bold ${scoreColor}`}>
          {isNaN(score) ? '–' : score}
        </td>

        {/* 📌 Verwijderknop */}
        <td className="p-2">
          <button
            onClick={() => onRemove(item.name)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ❌
          </button>
        </td>
      </tr>
    );
  });
}
