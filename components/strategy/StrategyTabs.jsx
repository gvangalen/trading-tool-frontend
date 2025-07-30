import { useState } from 'react';
import StrategyFormTrading from './StrategyFormTrading';
import StrategyFormDCA from './StrategyFormDCA';

export default function StrategyTabs({ onSubmit }) {
  const [activeTab, setActiveTab] = useState('trading');

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <button
          className={activeTab === 'trading' ? 'btn-active' : 'btn'}
          onClick={() => setActiveTab('trading')}
        >
          📈 Tradingstrategie
        </button>
        <button
          className={activeTab === 'dca' ? 'btn-active' : 'btn'}
          onClick={() => setActiveTab('dca')}
        >
          💰 DCA-strategie
        </button>
      </div>

      {activeTab === 'trading' && <StrategyFormTrading onSubmit={onSubmit} />}
      {activeTab === 'dca' && <StrategyFormDCA onSubmit={onSubmit} />}
    </div>
  );
}
