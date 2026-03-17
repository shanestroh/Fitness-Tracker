"use client";

import { useIdleLogout } from "@/hooks/useIdleLogout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useIdleLogout();

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}