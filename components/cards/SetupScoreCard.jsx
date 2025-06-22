import { Star } from 'lucide-react';

export default function SetupScoreCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border w-full max-w-sm">
      <div className="flex items-center mb-2 text-sm font-medium text-orange-600">
        <Star className="w-4 h-4 mr-2 text-orange-500" />
        1 actieve setup
      </div>
      <p className="text-sm text-gray-800">
        A-Plus Setup – <span className="font-semibold text-green-600">Score 85,0</span>
      </p>
    </div>
  );
}
