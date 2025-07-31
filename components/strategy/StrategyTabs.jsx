import { useState } from 'react';
import StrategyFormTrading from './StrategyFormTrading';
import StrategyFormDCA from './StrategyFormDCA';
import StrategyForm from './StrategyForm'; // ← handmatige strategie

export default function StrategyTabs({ onSubmit }) {
  const [activeTab, setActiveTab] = useState('trading');

  return (
    <div>
      {/* 🔘 Tab-knoppen */}
      <div className="flex space-x-2 mb-4">
        <button
          className={activeTab === 'trading' ? 'btn-active' : 'btn'}
          onClick={() => setActiveTab('trading')}
        >
          📈 Tradingstrategie (AI)
        </button>
        <button
          className={activeTab === 'dca' ? 'btn-active' : 'btn'}
          onClick={() => setActiveTab('dca')}
        >
          💰 DCA-strategie
        </button>
        <button
          className={activeTab === 'manual' ? 'btn-active' : 'btn'}
          onClick={() => setActiveTab('manual')}
        >
          ✍️ Handmatige strategie
        </button>
      </div>

      {/* 🧠 Tab inhoud */}
      {activeTab === 'trading' && <StrategyFormTrading onSubmit={onSubmit} />}
      {activeTab === 'dca' && <StrategyFormDCA onSubmit={onSubmit} />}
      {activeTab === 'manual' && <StrategyForm />}
    </div>
  );
}
