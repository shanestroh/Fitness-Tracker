"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIdleLogout } from "@/hooks/useIdleLogout";

export default function IdleLogoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useIdleLogout();

  useEffect(() => {
    let isChecking = false;

    async function checkAuth() {
      if (isChecking) return;
      isChecking = true;

      try {
        const res = await fetch("/api/check-auth", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          router.push("/login");
          router.refresh();
        }
      } catch {
        // Ignore temporary network issues
      } finally {
        isChecking = false;
      }
    }

    function handleFocus() {
      checkAuth();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    }

    function handlePageShow() {
      checkAuth();
    }

    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  return <>{children}</>;
}