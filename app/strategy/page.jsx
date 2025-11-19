'use client';

import { useState, useMemo, useEffect } from 'react';
import StrategyList from '@/components/strategy/StrategyList';
import StrategyTabs from '@/components/strategy/StrategyTabs';
import { useSetupData } from '@/hooks/useSetupData';
import { useStrategyData } from '@/hooks/useStrategyData';
import { createStrategy } from '@/lib/api/strategy';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function StrategyPage() {
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const { setups, loadSetups } = useSetupData();
  const { strategies, loadStrategies } = useStrategyData();

  // 🔄 Bij laden pagina → altijd data ophalen
  useEffect(() => {
    loadSetups();
    loadStrategies();
  }, []);

  // 🔄 Herladen na opslaan strategie
  const reloadAll = () => {
    loadSetups();
    loadStrategies();
  };

  // 🎉 Toast helper
  const handleSuccess = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 4000);
  };

  // 📤 STRATEGIE OPSLAAN
  const handleStrategySubmit = async (strategy) => {
    try {
      const setup = setups.find(
        (s) => String(s.id) === String(strategy.setup_id)
      );

      if (!setup) {
        setToast('❌ Geen geldige setup geselecteerd.');
        return;
      }

      const payload = {
        ...strategy,
        setup_id: setup.id,
        setup_name: setup.name,
        symbol: setup.symbol,
        timeframe: setup.timeframe,
        explanation: strategy.explanation || strategy.rules || '',
        entry: strategy.entry ?? null,
        targets: strategy.targets || [],
        stop_loss: strategy.stop_loss ?? null,
        favorite: strategy.favorite ?? false,
        tags: strategy.tags || [],
      };

      console.log('📤 Strategie opslaan (payload):', payload);

      await createStrategy(payload);

      handleSuccess('✅ Strategie succesvol opgeslagen!');

      // 🔄 DIRECT HERLADEN → nieuwe strategie verschijnt meteen!
      reloadAll();
    } catch (err) {
      console.error('❌ Fout bij opslaan strategie:', err);
      setToast('❌ Strategie opslaan mislukt.');
    }
  };

  // 🔍 FILTERS PER TYPE (welke setups hebben nog géén strategie van dit type)
  const setupsWithoutTrading = useMemo(
    () =>
      setups.filter(
        (s) =>
          !strategies.some(
            (strat) =>
              String(strat.setup_id) === String(s.id) &&
              String(strat.strategy_type) === 'trading'
          )
      ),
    [setups, strategies]
  );

  const setupsWithoutDCA = useMemo(
    () =>
      setups.filter(
        (s) =>
          !strategies.some(
            (strat) =>
              String(strat.setup_id) === String(s.id) &&
              String(strat.strategy_type) === 'dca'
          )
      ),
    [setups, strategies]
  );

  const setupsWithoutManual = useMemo(
    () =>
      setups.filter(
        (s) =>
          !strategies.some(
            (strat) =>
              String(strat.setup_id) === String(s.id) &&
              String(strat.strategy_type) === 'manual'
          )
      ),
    [setups, strategies]
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">📈 Strategieën</h1>
        <p className="text-gray-600 text-sm">
          Bekijk en beheer je strategieën. Kies een methode: AI, DCA of handmatig.
        </p>
      </header>

      {/* Zoekveld */}
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-xl font-semibold">📋 Huidige Strategieën</h3>
        <input
          type="text"
          placeholder="🔎 Zoek op asset of tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-60 text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Strategielijst */}
      <section>
        <StrategyList searchTerm={search} />
      </section>

      {/* Toast */}
      {toast && (
        <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded text-sm">
          {toast}
        </div>
      )}

      {/* Nieuwe strategie sectie */}
      <section className="pt-10 border-t">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">➕ Nieuwe Strategie Toevoegen</h2>
          <InfoTooltip text="Per tab zie je alleen setups die nog geen strategie van dat type hebben." />
        </div>

        <StrategyTabs
          onSubmit={handleStrategySubmit}
          setupsTrading={setupsWithoutTrading}
          setupsDCA={setupsWithoutDCA}
          setupsManual={setupsWithoutManual}
        />
      </section>
    </div>
  );
}
