"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const IDLE_TIMEOUT_MS = 10 * 1000; // change back later

export function useIdleLogout() {
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Do not run idle logout on login page
    if (pathname === "/login") return;

    function clearExistingTimer() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    async function logoutUser() {
      try {
        await fetch("/api/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch {
        // ignore
      } finally {
        window.location.href = "/login";
      }
    }

    function resetTimer() {
      clearExistingTimer();

      timeoutRef.current = setTimeout(() => {
        console.log("Idle timeout reached");
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
  }, [pathname]);
}