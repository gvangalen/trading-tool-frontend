import { Card, CardContent } from "@/components/ui/card";
import { Gauge } from "lucide-react";

export default function TechnicalScoreCard({ score = 14.3 }) {
  return (
    <Card className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-300">
          <Gauge className="w-4 h-4" />
          <span className="text-sm font-semibold">Technisch</span>
        </div>
        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
          {score}
        </p>
      </CardContent>
    </Card>
  );
}
