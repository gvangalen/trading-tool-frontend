'use client';

import SetupForm from '@/components/setup/SetupForm';
import SetupList from '@/components/setup/SetupList';

export default function SetupPage() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-center">⚙️ Setup Editor</h2>

      <SetupForm />
      <SetupList />
    </div>
  );
}
