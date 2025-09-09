import { useMacroData } from '@/hooks/useMacroData';

export default function MacroDayTable() {
  const {
    macroData,
    calculateMacroScore,
    getExplanation,
    handleEdit,
    handleRemove,
  } = useMacroData();

  return macroData.map((item) => {
    const score = calculateMacroScore(item.name, parseFloat(item.value));
    const scoreColor =
      score >= 2 ? 'text-green-600' :
      score <= -2 ? 'text-red-600' :
      'text-gray-600';

    return (
      <tr key={item.name} className="border-t dark:border-gray-700">
        <td className="p-2 font-medium" title={getExplanation(item.name)}>{item.name}</td>
        <td className="p-2">
          <input
            type="number"
            className="w-20 border px-1 py-0.5 rounded"
            value={item.value}
            onChange={(e) => handleEdit(item.name, e.target.value)}
          />
        </td>
        <td className="p-2 italic text-gray-500">{item.trend ?? '–'}</td>
        <td className="p-2 italic text-gray-500">{item.interpretation ?? '–'}</td>
        <td className="p-2 italic text-gray-500">{item.action ?? '–'}</td>
        <td className={`p-2 font-bold ${scoreColor}`}>{score}</td>
        <td className="p-2">
          <button
            onClick={() => handleRemove(item.name)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ❌
          </button>
        </td>
      </tr>
    );
  });
}
