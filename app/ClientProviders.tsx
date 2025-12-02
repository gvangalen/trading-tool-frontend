"use client";

import { ModalProvider } from "@/components/modal/ModalProvider";

export default function ClientProviders({ children }) {
  return <ModalProvider>{children}</ModalProvider>;
}
