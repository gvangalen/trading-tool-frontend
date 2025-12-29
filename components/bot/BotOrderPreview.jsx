import { CheckCircle, XCircle } from "lucide-react";

export default function BotOrderPreview({
  order,
  onMarkExecuted,
  onSkip,
}) {
  if (!order) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">Order Preview</h3>

      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Symbol</p>
          <p className="font-medium">{order.symbol}</p>
        </div>
        <div>
          <p className="text-gray-500">Side</p>
          <p className="font-medium">{order.action}</p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-medium">€{order.amount}</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <p className="font-medium">{order.status}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={onMarkExecuted}
          className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white"
        >
          <CheckCircle className="w-4 h-4" />
          Mark Executed
        </button>

        <button
          onClick={onSkip}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200"
        >
          <XCircle className="w-4 h-4" />
          Skip Today
        </button>
      </div>
    </div>
  );
}
