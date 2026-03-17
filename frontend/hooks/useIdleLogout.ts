"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const IDLE_TIMEOUT_MS = 10 * 60 * 1000;

export function useIdleLogout() {
  const router = useRouter();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function clearExistingTimer() {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    }

    async function logoutUser() {
      try {
        await fetch("/api/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch {
        // even if logout request fails, still redirect
      } finally {
        router.push("/login");
      }
    }

    function resetTimer() {
      clearExistingTimer();
      timeoutRef.current = window.setTimeout(() => {
        logoutUser();
      }, IDLE_TIMEOUT_MS);
    }

    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    for (const event of events) {
      window.addEventListener(event, resetTimer);
    }

    resetTimer();

    return () => {
      clearExistingTimer();
      for (const event of events) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [router]);
}