export default function StrategyFormManual({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const strategy = {
      strategy_type: 'manual',
      asset: e.target.asset.value,
      timeframe: e.target.timeframe.value,
      entry: e.target.entry.value,
      target: e.target.target.value,
      stop_loss: e.target.stop_loss.value,
      explanation: e.target.explanation.value,
    };
    onSubmit(strategy);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="asset" placeholder="Asset (BTC)" className="input" />
      <input name="timeframe" placeholder="Timeframe (1D)" className="input" />
      <input name="entry" placeholder="Entry prijs (€)" className="input" />
      <input name="target" placeholder="Target prijs (€)" className="input" />
      <input name="stop_loss" placeholder="Stop loss (€)" className="input" />
      <textarea name="explanation" placeholder="Uitleg / notities..." className="input" />
      <button type="submit" className="btn-primary">💾 Strategie opslaan</button>
    </form>
  );
}
