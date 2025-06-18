'use client';

import { useSetupData } from '@/hooks/useSetupData';
import SetupForm from './SetupForm';
import SetupList from './SetupList';
import CardWrapper from '@/components/ui/CardWrapper';

export default function SetupManager() {
  const { reloadSetups } = useSetupData();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 🔧 Titel */}
      <h2 className="text-2xl font-bold">⚙️ Setupbeheer</h2>

      {/* 🧾 Setupformulier in card */}
      <CardWrapper title="➕ Nieuwe Setup">
        <SetupForm onSubmitted={reloadSetups} />
      </CardWrapper>

      {/* 📋 Setuplijst in card */}
      <CardWrapper title="📊 Actieve Setups">
        <SetupList />
      </CardWrapper>
    </div>
  );
}
