// ✅ TechnicalScoreCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Gauge } from "lucide-react";

export default function TechnicalScoreCard({ score = 14.3 }) {
  return (
    <Card className="bg-blue-100 dark:bg-blue-900">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Gauge className="text-blue-500 w-4 h-4" />
          <span className="text-sm font-medium">Technisch</span>
        </div>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
          {score}
        </p>
      </CardContent>
    </Card>
  );
}
