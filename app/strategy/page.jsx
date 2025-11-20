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
  const [refreshKey, setRefreshKey] = useState(0);  // ✅ trigger voor rerender filters

  const { setups, loadSetups } = useSetupData();
  const { strategies, loadStrategies } = useStrategyData();

  // Initial load
  useEffect(() => {
    loadSetups();
    loadStrategies();
  }, []);

  // 🔄 Trigger alle lijst-herberekeningen
  const refreshEverything = () => {
    // 1. Eerst strategies & setups herladen
    loadStrategies();
    loadSetups();

    // 2. Daarna rerender & recalculation for tabs
    setTimeout(() => {
      setRefreshKey((k) => k + 1);   // 🔥 Force full recalculation
    }, 30);
  };

  // Toast helper
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

      await createStrategy(payload);
      handleSuccess('✅ Strategie succesvol opgeslagen!');

      // 🔥 De echte fix → realtime refresh
      refreshEverything();

    } catch (err) {
      console.error('❌ Fout bij opslaan strategie:', err);
      setToast('❌ Strategie opslaan mislukt.');
    }
  };

  // 🔍 FILTERS PER TYPE (nu afhankelijk van refreshKey!)
  const setupsWithoutTrading = useMemo(() => {
    return setups.filter(
      (s) =>
        !strategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type).toLowerCase() === 'trading'
        )
    );
  }, [setups, strategies, refreshKey]);

  const setupsWithoutDCA = useMemo(() => {
    return setups.filter(
      (s) =>
        !strategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type).toLowerCase() === 'dca'
        )
    );
  }, [setups, strategies, refreshKey]);

  const setupsWithoutManual = useMemo(() => {
    return setups.filter(
      (s) =>
        !strategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type).toLowerCase() === 'manual'
        )
    );
  }, [setups, strategies, refreshKey]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">📈 Strategieën</h1>
        <p className="text-gray-600 text-sm">
          Bekijk en beheer je strategieën. Kies een methode: AI, DCA of handmatig.
        </p>
      </header>

      {/* Zoek + lijst */}
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

      <section>
        <StrategyList searchTerm={search} key={refreshKey} />
      </section>

      {toast && (
        <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded text-sm">
          {toast}
        </div>
      )}

      {/* Nieuwe strategie */}
      <section className="pt-10 border-t">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">➕ Nieuwe Strategie Toevoegen</h2>
          <InfoTooltip text="Per tab zie je alleen setups die nog geen strategie van dat type hebben." />
        </div>

        <StrategyTabs
          key={refreshKey}               // 🔥 Force fully refreshed tabs
          onSubmit={handleStrategySubmit}
          setupsTrading={setupsWithoutTrading}
          setupsDCA={setupsWithoutDCA}
          setupsManual={setupsWithoutManual}
        />
      </section>
    </div>
  );
}
