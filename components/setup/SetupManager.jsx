'use client';

import { useSetupData } from '@/hooks/useSetupData';
import SetupForm from './SetupForm';
import SetupList from './SetupList';
import CardWrapper from '@/components/ui/CardWrapper';

export default function SetupManager() {
  const { reloadSetups } = useSetupData();

  // Setup reloaden na toevoegen/bewerken
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
        <h2 className="text-3xl font-semibold text-[var(--text-dark)] tracking-tight">
          ⚙️ Setupbeheer
        </h2>
      </div>

      {/* Setup toevoegen */}
      <CardWrapper title="➕ Nieuwe Setup">
        <div className="text-sm text-[var(--text-light)] mb-4">
          Vul hieronder alle details in om een nieuwe trading-setup toe te voegen.
        </div>

        <SetupForm onSubmitted={handleRefresh} />
      </CardWrapper>

      {/* Setup lijst */}
      <CardWrapper title="📊 Actieve Setups">
        <div className="text-sm text-[var(--text-light)] mb-4">
          Bekijk, bewerk of verwijder bestaande setups.
        </div>

        <SetupList onUpdated={handleRefresh} />
      </CardWrapper>
    </div>
  );
}
