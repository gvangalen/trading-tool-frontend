import { Brain } from "lucide-react";

export default function BotDecisionCard({ decision }) {
  if (!decision) return null;

  const actionColor = {
    BUY: "text-green-600",
    HOLD: "text-yellow-600",
    SELL: "text-red-600",
    OBSERVE: "text-blue-600",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Bot Decision Today</h2>
        </div>
        <span className="text-sm text-gray-500">{decision.date}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-500">Action</p>
          <p
            className={`text-3xl font-bold ${actionColor[decision.action]}`}
          >
            {decision.action}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-3xl font-bold">€{decision.amount}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Confidence</p>
          <p className="text-3xl font-bold">{decision.confidence}</p>
        </div>
      </div>

      {decision.reasons?.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Why</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {decision.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
