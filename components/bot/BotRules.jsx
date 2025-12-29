export default function BotRules({ rules }) {
  if (!rules || rules.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">Bot Rules</h3>

      <ul className="space-y-2 text-sm">
        {rules.map((r, i) => (
          <li
            key={i}
            className="flex justify-between border-b pb-2"
          >
            <span>{r.rule}</span>
            <span className="font-medium">{r.action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
