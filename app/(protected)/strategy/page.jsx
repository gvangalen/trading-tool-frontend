"use client";

import { useState, useMemo, useEffect } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  LineChart,
  Search,
  PlusCircle,
  ClipboardList,
} from "lucide-react";

import StrategyList from "@/components/strategy/StrategyList";
import StrategyTabs from "@/components/strategy/StrategyTabs";
import ActiveStrategyTodayCard from "@/components/strategy/ActiveStrategyTodayCard";

import { useSetupData } from "@/hooks/useSetupData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { useOnboarding } from "@/hooks/useOnboarding";

import {
  createStrategy,
  updateStrategy,
  deleteStrategy,
} from "@/lib/api/strategy";

import CardWrapper from "@/components/ui/CardWrapper";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

// ⭐ ONBOARDING
import OnboardingBanner from "@/components/onboarding/OnboardingBanner";

export default function StrategyPage() {
  const { showSnackbar } = useModal();

  // ===============================
  // 🧭 ONBOARDING
  // ===============================
  const { status, completeStep } = useOnboarding();

  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const { setups, loadSetups } = useSetupData();
  const { strategies, loadStrategies } = useStrategyData();

  /* -------------------------------------------------- */
  /* SAFE ARRAYS */
  /* -------------------------------------------------- */
  const safeSetups = Array.isArray(setups) ? setups : [];
  const safeStrategies = Array.isArray(strategies) ? strategies : [];

  /* -------------------------------------------------- */
  /* INITIAL LOAD */
  /* -------------------------------------------------- */
  useEffect(() => {
    loadSetups();
    loadStrategies();
  }, []);

  /* -------------------------------------------------- */
  /* 🔥 ONBOARDING TRIGGER
  -------------------------------------------------- */
  useEffect(() => {
    if (
      Array.isArray(safeStrategies) &&
      safeStrategies.length > 0 &&
      status &&
      status.has_strategy === false
    ) {
      completeStep("strategy");
    }
  }, [safeStrategies, status, completeStep]);

  /* -------------------------------------------------- */
  /* 🔁 CENTRALE REFRESH */
  /* -------------------------------------------------- */
  const refreshEverything = () => {
    loadStrategies();
    loadSetups();
    setTimeout(() => setRefreshKey((k) => k + 1), 30);
  };

  /* -------------------------------------------------- */
  /* 🗑 DELETE STRATEGY */
  /* -------------------------------------------------- */
  const handleDeleteStrategy = async (id) => {
    try {
      await deleteStrategy(id);
      showSnackbar("Strategie verwijderd", "success");
      refreshEverything();
    } catch {
      showSnackbar("Strategie verwijderen mislukt", "danger");
    }
  };

  /* -------------------------------------------------- */
  /* ✏️ UPDATE STRATEGY */
  /* -------------------------------------------------- */
  const handleUpdateStrategy = async (id, data) => {
    try {
      await updateStrategy(id, data);
      showSnackbar("Strategie bijgewerkt", "success");
      refreshEverything();
    } catch {
      showSnackbar("Strategie bijwerken mislukt", "danger");
    }
  };

  /* -------------------------------------------------- */
  /* ➕ CREATE STRATEGY */
  /* -------------------------------------------------- */
  const handleStrategySubmit = async (strategy) => {
    try {
      const setup = safeSetups.find(
        (s) => String(s.id) === String(strategy.setup_id)
      );

      if (!setup) {
        showSnackbar("Geen geldige setup geselecteerd.", "danger");
        return;
      }

      await createStrategy({
        ...strategy,
        setup_id: setup.id,
        setup_name: setup.name,
        symbol: setup.symbol,
        timeframe: setup.timeframe,
      });

      showSnackbar("Strategie opgeslagen ✔", "success");
      refreshEverything();
    } catch {
      showSnackbar("Strategie opslaan mislukt.", "danger");
    }
  };

  /* -------------------------------------------------- */
  /* FILTERS */
  /* -------------------------------------------------- */
  const setupsWithoutTrading = useMemo(() => {
    return safeSetups.filter(
      (s) =>
        !safeStrategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type).toLowerCase() === "trading"
        )
    );
  }, [safeSetups, safeStrategies, refreshKey]);

  const setupsWithoutDCA = useMemo(() => {
    return safeSetups.filter(
      (s) =>
        !safeStrategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type).toLowerCase() === "dca"
        )
    );
  }, [safeSetups, safeStrategies, refreshKey]);

  const setupsWithoutManual = useMemo(() => {
    return safeSetups.filter(
      (s) =>
        !safeStrategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type).toLowerCase() === "manual"
        )
    );
  }, [safeSetups, safeStrategies, refreshKey]);

  /* -------------------------------------------------- */
  /* RENDER */
  /* -------------------------------------------------- */
  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      <OnboardingBanner step="strategy" />

      <div className="flex items-center gap-3">
        <LineChart size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)]">
          Strategieën
        </h1>
      </div>

      <p className="text-[var(--text-light)] max-w-2xl">
        De AI analyseert je strategieën én geeft je vandaag een concreet plan.
      </p>

      {/* ✅ INSIGHT + ACTIE NAAST ELKAAR */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AgentInsightPanel category="strategy" />
        <ActiveStrategyTodayCard />
      </div>

      {/* ===================== */}
      {/* BESTAANDE STRATEGIEËN */}
      {/* ===================== */}
      <CardWrapper
        title={
          <div className="flex items-center gap-2">
            <ClipboardList className="text-[var(--primary)]" size={20} />
            <span>Huidige Strategieën</span>
          </div>
        }
      >
        <div className="flex items-center mb-4 gap-2">
          <Search size={18} className="text-[var(--text-light)]" />
          <input
            type="text"
            placeholder="Zoek op asset of tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm"
          />
        </div>

        <StrategyList
          strategies={safeStrategies}
          searchTerm={search}
          onRefresh={refreshEverything}
          onDelete={handleDeleteStrategy}
          onUpdate={handleUpdateStrategy}
          key={refreshKey}
        />
      </CardWrapper>

      {/* ===================== */}
      {/* NIEUWE STRATEGIE */}
      {/* ===================== */}
      <CardWrapper
        title={
          <div className="flex items-center gap-2">
            <PlusCircle className="text-[var(--primary)]" size={20} />
            <span>Nieuwe Strategie</span>
          </div>
        }
      >
        <StrategyTabs
          key={refreshKey}
          onSubmit={handleStrategySubmit}
          setupsTrading={setupsWithoutTrading}
          setupsDCA={setupsWithoutDCA}
          setupsManual={setupsWithoutManual}
        />
      </CardWrapper>
    </div>
  );
}
