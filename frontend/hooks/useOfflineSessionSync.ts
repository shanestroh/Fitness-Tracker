"use client";

import { useCallback, useEffect, useState } from "react";
import { getPendingQueueCount } from "@/lib/offline/sessionQueueHelpers";
import { syncQueuedSessionActions } from "@/lib/offline/syncQueuedSessionActions";

type UseOfflineSessionSyncArgs = {
  sessionId: string;
  loadSession: (id: string) => Promise<void>;
};

export function useOfflineSessionSync({
  sessionId,
  loadSession,
}: UseOfflineSessionSyncArgs) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  const [pendingSetEditsById, setPendingSetEditsById] = useState<Record<string, boolean>>({});
  const [pendingExerciseEditsById, setPendingExerciseEditsById] = useState<Record<number, boolean>>({});

  const refreshPendingQueueCount = useCallback(
    (currentSessionId: string) => {
      setPendingQueueCount(getPendingQueueCount(currentSessionId));
    },
    []
  );

  const markSetPending = useCallback((setId: number | string) => {
    setPendingSetEditsById((prev) => ({
      ...prev,
      [String(setId)]: true,
    }));
  }, []);

  const clearPendingSet = useCallback((setId: number | string) => {
    setPendingSetEditsById((prev) => {
      const next = { ...prev };
      delete next[String(setId)];
      return next;
    });
  }, []);

  const markExercisePending = useCallback((exerciseId: number) => {
    setPendingExerciseEditsById((prev) => ({
      ...prev,
      [exerciseId]: true,
    }));
  }, []);

  const clearPendingExercise = useCallback((exerciseId: number) => {
    setPendingExerciseEditsById((prev) => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  }, []);

  const syncQueuedActions = useCallback(async () => {
    if (!sessionId) return;

    const syncedAny = await syncQueuedSessionActions({
      sessionId,
      onQueueChange: () => {
        setPendingQueueCount(getPendingQueueCount(sessionId));
      },
      onSetEditSynced: (setId) => {
        clearPendingSet(setId);
      },
      onExerciseEditSynced: (exerciseId) => {
        clearPendingExercise(exerciseId);
      },
    });

    if (syncedAny) {
      await loadSession(sessionId);
    }
  }, [sessionId, loadSession, clearPendingSet, clearPendingExercise]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(window.navigator.onLine);

    function handleOnlineStatusChange() {
      setIsOnline(window.navigator.onLine);

      if (sessionId) {
        setPendingQueueCount(getPendingQueueCount(sessionId));
      }
    }

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    syncQueuedActions();

    function handleOnline() {
      syncQueuedActions();
    }

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [sessionId, syncQueuedActions]);

  return {
    isOnline,
    pendingQueueCount,
    pendingSetEditsById,
    pendingExerciseEditsById,
    refreshPendingQueueCount,
    syncQueuedActions,
    markSetPending,
    clearPendingSet,
    markExercisePending,
    clearPendingExercise,
  };
}