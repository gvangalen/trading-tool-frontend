// ✅ app/onboarding/page.jsx — vervanger voor oude onboarding.html
'use client';
import OnboardingProgress from '@/components/ui/OnboardingProgress';

export default function OnboardingPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🚀 Onboarding</h1>
      <p className="text-gray-600">Volg de 4 stappen om het dashboard volledig te activeren. Je voortgang wordt automatisch opgeslagen.</p>

      <OnboardingProgress />

      <div className="mt-8 space-y-2 text-sm text-gray-500">
        <p>📝 Stap 1: Setup aanmaken</p>
        <p>📈 Stap 2: Technische indicatoren toevoegen</p>
        <p>📊 Stap 3: Macrodata ophalen</p>
        <p>📄 Stap 4: Dashboard openen</p>
      </div>
    </div>
  );
}
