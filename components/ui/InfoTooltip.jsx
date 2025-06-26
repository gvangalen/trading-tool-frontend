'use client';

import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

export default function InfoTooltip({ text }) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <span className="ml-1 cursor-pointer text-gray-400">ℹ️</span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="z-50 overflow-hidden rounded-md border bg-white px-3 py-2 text-sm text-black shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            sideOffset={5}
          >
            {text}
            <RadixTooltip.Arrow className="fill-current text-gray-300 dark:text-gray-700" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
