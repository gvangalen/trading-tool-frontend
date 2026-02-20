"use client";

import { Settings } from "lucide-react";
import { useModal } from "@/components/modal/ModalProvider";
import IndicatorScorePanel from "./IndicatorScorePanel";

export default function IndicatorScoreButton({ indicator, category }) {
  const { openModal } = useModal();

  const openEditor = () => {
    openModal({
      title: `Score instellingen — ${indicator}`,
      content: (
        <IndicatorScorePanel
          indicator={indicator}
          category={category}
        />
      ),
    });
  };

  return (
    <button
      onClick={openEditor}
      className="text-gray-400 hover:text-blue-500"
      title="Score instellingen"
    >
      <Settings size={16} />
    </button>
  );
}
