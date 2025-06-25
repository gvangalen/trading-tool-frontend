import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function InfoTooltip({ text }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="ml-1 cursor-pointer text-gray-400">ℹ️</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2 rounded shadow">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
