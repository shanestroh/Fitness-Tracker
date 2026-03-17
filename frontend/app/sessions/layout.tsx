import { useIdleLogout } from "@/hooks/useIdleLogout";

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useIdleLogout();

  return <>{children}</>;
}