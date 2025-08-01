import { useState, useEffect } from 'react';
import { fetchSetups } from '@/lib/api/setup';

export default function StrategyFormManual({ onSubmit }) {
  const [setups, setSetups] = useState([]);

  useEffect(() => {
    const loadSetups = async () => {
      const data = await fetchSetups();
      setSetups(data);
    };
    loadSetups();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSetup = setups.find((s) => s.id === parseInt(e.target.setup_id.value));
    if (!selectedSetup) return;

    const strategy = {
      setup_id: selectedSetup.id,
      setup_name: selectedSetup.name,
      asset: selectedSetup.symbol,
      timeframe: selectedSetup.timeframe,
      strategy_type: 'manual',
      entry: e.target.entry.value,
      target: e.target.target.value,
      stop_loss: e.target.stop_loss.value,
      explanation: e.target.explanation.value,
    };
    onSubmit(strategy);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="text-sm text-gray-600">Koppel aan Setup</label>
      <select name="setup_id" className="input" required>
        <option value="">-- Kies een setup --</option>
        {setups.map((setup) => (
          <option key={setup.id} value={setup.id}>
            {setup.name} ({setup.symbol} – {setup.timeframe})
          </option>
        ))}
      </select>

      <input name="entry" placeholder="Entry prijs (€)" className="input" />
      <input name="target" placeholder="Target prijs (€)" className="input" />
      <input name="stop_loss" placeholder="Stop loss (€)" className="input" />
      <textarea name="explanation" placeholder="Uitleg / notities..." className="input" />
      <button type="submit" className="btn-primary">💾 Strategie opslaan</button>
    </form>
  );
}
