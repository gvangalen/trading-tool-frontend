'use client';

import { useSetupData } from '@/hooks/useSetupData'; // ✅ gebruik onze hook
import SetupForm from './SetupForm';
import SetupList from './SetupList';

export default function SetupManager() {
  const { reloadSetups } = useSetupData(); // 🔥 herladen via hook

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">⚙️ Setupbeheer</h2>
      <SetupForm onSubmitted={reloadSetups} />
      <SetupList />
    </div>
  );
}
