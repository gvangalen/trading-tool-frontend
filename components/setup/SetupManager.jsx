'use client';

import { useSetupData } from '@/hooks/useSetupData';
import SetupForm from './SetupForm';
import SetupList from './SetupList';
import CardWrapper from '@/components/ui/CardWrapper';

// Nieuwe icons
import { Settings, PlusCircle, BarChart3 } from 'lucide-react';

export default function SetupManager() {
  const { reloadSetups } = useSetupData();

  // Reload setups na toevoegen/bewerken
  const handleRefresh = async () => {
    await reloadSetups();
  };

  return (
    <div
      className="
        max-w-6xl mx-auto p-8 space-y-10
        animate-fade-slide
      "
    >
      {/* Titel */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-3xl font-semibold text-[var(--text-dark)] tracking-tight">
          <Settings size={26} className="text-[var(--primary)]" />
          Setupbeheer
        </h2>
      </div>

      {/* Setup toevoegen */}
      <CardWrapper
        title={
          <span className="flex items-center gap-2">
            <PlusCircle size={18} className="text-[var(--primary)]" />
            Nieuwe Setup
          </span>
        }
      >
        <div className="text-sm text-[var(--text-light)] mb-4">
          Vul hieronder alle details in om een nieuwe trading-setup toe te voegen.
        </div>

        <SetupForm onSubmitted={handleRefresh} />
      </CardWrapper>

      {/* Setup lijst */}
      <CardWrapper
        title={
          <span className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[var(--primary)]" />
            Actieve Setups
          </span>
        }
      >
        <div className="text-sm text-[var(--text-light)] mb-4">
          Bekijk, bewerk of verwijder bestaande setups.
        </div>

        <SetupList onUpdated={handleRefresh} />
      </CardWrapper>
    </div>
  );
}
