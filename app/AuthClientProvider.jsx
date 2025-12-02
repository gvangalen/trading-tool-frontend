"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";

export default function AuthClientProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
