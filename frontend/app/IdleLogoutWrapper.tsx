"use client";

import { useIdleLogout } from "@/hooks/useIdleLogout";

export default function IdleLogoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useIdleLogout();
  return <>{children}</>;
}