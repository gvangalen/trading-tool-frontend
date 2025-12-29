export default function BotScores({ scores }) {
  if (!scores) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">Scores</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(scores).map(([key, value]) => (
          <div
            key={key}
            className="border rounded p-4 text-center"
          >
            <p className="text-sm text-gray-500 capitalize">{key}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
