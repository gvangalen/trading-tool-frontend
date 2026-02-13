"use client";

import { AuthProvider } from "@/context/AuthProvider";
import { ModalProvider } from "@/components/modal/ModalProvider";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </AuthProvider>
  );
}
