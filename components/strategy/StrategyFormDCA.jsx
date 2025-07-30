export default function StrategyFormDCA({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const strategy = {
      strategy_type: 'dca',
      amount: e.target.amount.value,
      frequency: e.target.frequency.value,
      rules: e.target.rules.value,
    };
    onSubmit(strategy);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="amount" placeholder="Bedrag per keer (€)" />
      <select name="frequency">
        <option value="weekly">Wekelijks</option>
        <option value="monthly">Maandelijks</option>
      </select>
      <textarea name="rules" placeholder="Koopregels (bijv. bij Fear & Greed score)" />
      <button type="submit">💾 DCA-strategie opslaan</button>
    </form>
  );
}
