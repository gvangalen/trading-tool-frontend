"use client";

import AuthClientProvider from "../AuthClientProvider";

export default function PublicLayout({ children }) {
  return (
    <AuthClientProvider>
      {children}
    </AuthClientProvider>
  );
}
