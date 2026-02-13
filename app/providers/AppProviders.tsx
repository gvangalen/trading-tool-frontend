"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { ModalProvider } from "@/components/modal/ModalProvider";
import { Toaster } from "react-hot-toast";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ModalProvider>
        <Toaster position="top-right" />
        {children}
      </ModalProvider>
    </AuthProvider>
  );
}
