'use client';
import { useState } from 'react';
import SetupForm from './SetupForm';
import SetupList from './SetupList';

export default function SetupManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Handig om setups opnieuw te laden na toevoegen/bewerken/verwijderen
  const reloadSetups = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">⚙️ Setupbeheer</h2>
      <SetupForm onSubmitted={reloadSetups} />
      <SetupList key={refreshKey} />
    </div>
  );
}
