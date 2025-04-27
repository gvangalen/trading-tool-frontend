// ✅ components/AssetSelector.jsx
'use client';

import { useEffect, useState } from 'react';

export default function AssetSelector({ onChange }) {
  const [symbol, setSymbol] = useState('BTC');

  useEffect(() => {
    if (onChange) onChange(symbol);
  }, [symbol, onChange]);

  return (
    <div className="my-4">
      <label htmlFor="symbolSelect" className="font-semibold mr-2">🔁 Kies asset:</label>
      <select
        id="symbolSelect"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="BTC">BTC</option>
        <option value="SOL">SOL</option>
      </select>
    </div>
  );
}

