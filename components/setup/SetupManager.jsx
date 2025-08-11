'use client';

import { useSetupData } from '@/hooks/useSetupData';
import SetupForm from './SetupForm';
import SetupList from './SetupList';
import CardWrapper from '@/components/ui/CardWrapper';

export default function SetupManager() {
  const { reloadSetups } = useSetupData();

  // Callback om na toevoegen/bewerken setups te herladen
  const handleRefresh = async () => {
    await reloadSetups();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 🔧 Titel */}
      <h2 className="text-2xl font-bold">⚙️ Setupbeheer</h2>

      {/* 🧾 Setupformulier met onSubmitted callback */}
      <CardWrapper title="➕ Nieuwe Setup">
        <SetupForm onSubmitted={handleRefresh} />
      </CardWrapper>

      {/* 📋 Lijst met bestaande setups met onUpdated callback */}
      <CardWrapper title="📊 Actieve Setups">
        <SetupList onUpdated={handleRefresh} />
      </CardWrapper>
    </div>
  );
}
