// components/cards/ActiveTradeCard.jsx
'use client';
export default function ActiveTradeCard() {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full">
      <h3 className="text-lg font-semibold mb-2">📊 Actieve Trade</h3>
      <p><strong>Setup:</strong> BTC Swing Buy</p>
      <p><strong>Entry:</strong> $97.000</p>
      <p><strong>TP1:</strong> $104.000</p>
      <p><strong>Stop:</strong> $94.500</p>
    </div>
  );
}
