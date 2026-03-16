import { removeQueuedAction, getOfflineQueue } from "@/lib/offline/offlineQueue";
import { apiFetch } from "@/lib/apiFetch";

type SyncArgs = {
  sessionId: string;
  onQueueChange: () => void;
  onSetEditSynced?: (setId: number) => void;
  onExerciseEditSynced?: (exerciseId: number) => void;
};

export async function syncQueuedSessionActions({
  sessionId,
  onQueueChange,
  onSetEditSynced,
  onExerciseEditSynced,
}: SyncArgs): Promise<boolean> {
  const queue = getOfflineQueue().filter((item) => item.sessionId === sessionId);

  if (queue.length === 0) return false;

  let syncedAny = false;

  for (const item of queue) {
    try {
      if (item.type === "add-set") {
        // Defensive cleanup: temp exercise ids should never be sent to backend
        if (item.exerciseId < 0) {
          removeQueuedAction(item.id);
          onQueueChange();
          continue;
        }

        const res = await apiFetch(`/exercises/${item.exerciseId}/sets`, {
          method: "POST",
          body: JSON.stringify(item.payload),
        });

        if (!res.ok) {
          // Defensive cleanup: bad client-side or impossible action
          if (res.status >= 400 && res.status < 500) {
            removeQueuedAction(item.id);
            onQueueChange();
          }
          continue;
        }

        removeQueuedAction(item.id);
        onQueueChange();
        syncedAny = true;
        continue;
      }

      if (item.type === "add-exercise") {
        const res = await apiFetch(`/sessions/${item.sessionId}/exercises`, {
          method: "POST",
          body: JSON.stringify(item.payload),
        });

        if (!res.ok) {
          if (res.status >= 400 && res.status < 500) {
            removeQueuedAction(item.id);
            onQueueChange();
          }
          continue;
        }

        removeQueuedAction(item.id);
        onQueueChange();
        syncedAny = true;
        continue;
      }

      if (item.type === "edit-set") {
        const res = await apiFetch(`/sets/${item.setId}`, {
          method: "PATCH",
          body: JSON.stringify(item.payload),
        });

        if (!res.ok) {
          // If set no longer exists, stop retrying forever
          if (res.status === 404 || (res.status >= 400 && res.status < 500)) {
            removeQueuedAction(item.id);
            onQueueChange();
            onSetEditSynced?.(item.setId);
          }
          continue;
        }

        removeQueuedAction(item.id);
        onQueueChange();
        onSetEditSynced?.(item.setId);
        syncedAny = true;
        continue;
      }

      if (item.type === "delete-set") {
        const res = await apiFetch(`/sets/${item.setId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          // Already gone = treat as resolved
          if (res.status === 404 || (res.status >= 400 && res.status < 500)) {
            removeQueuedAction(item.id);
            onQueueChange();
            onSetEditSynced?.(item.setId);
          }
          continue;
        }

        removeQueuedAction(item.id);
        onQueueChange();
        onSetEditSynced?.(item.setId);
        syncedAny = true;
        continue;
      }

      if (item.type === "edit-exercise") {
        const res = await apiFetch(`/exercises/${item.exerciseId}`, {
          method: "PATCH",
          body: JSON.stringify(item.payload),
        });

        if (!res.ok) {
          if (res.status === 404 || (res.status >= 400 && res.status < 500)) {
            removeQueuedAction(item.id);
            onQueueChange();
            onExerciseEditSynced?.(item.exerciseId);
          }
          continue;
        }

        removeQueuedAction(item.id);
        onQueueChange();
        onExerciseEditSynced?.(item.exerciseId);
        syncedAny = true;
        continue;
      }

      if (item.type === "delete-exercise") {
        const res = await apiFetch(`/exercises/${item.exerciseId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          // Already deleted = success enough
          if (res.status === 404 || (res.status >= 400 && res.status < 500)) {
            removeQueuedAction(item.id);
            onQueueChange();
            onExerciseEditSynced?.(item.exerciseId);
          }
          continue;
        }

        removeQueuedAction(item.id);
        onQueueChange();
        onExerciseEditSynced?.(item.exerciseId);
        syncedAny = true;
        continue;
      }
    } catch {
      // network issue or backend still unavailable — keep queued
    }
  }

  return syncedAny;
}