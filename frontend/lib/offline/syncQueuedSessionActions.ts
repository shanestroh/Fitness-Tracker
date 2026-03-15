import { getOfflineQueue, removeQueuedAction } from "@/lib/offline/offlineQueue";
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
        const res = await apiFetch(`/exercises/${item.exerciseId}/sets`, {
          method: "POST",
          body: JSON.stringify(item.payload),
        });
        if (!res.ok) continue;
        removeQueuedAction(item.id);
        onQueueChange();
        syncedAny = true;
      }

      if (item.type === "add-exercise") {
        const res = await apiFetch(`/sessions/${item.sessionId}/exercises`, {
          method: "POST",
          body: JSON.stringify(item.payload),
        });
        if (!res.ok) continue;
        removeQueuedAction(item.id);
        onQueueChange();
        syncedAny = true;
      }

      if (item.type === "edit-set") {
        const res = await apiFetch(`/sets/${item.setId}`, {
          method: "PATCH",
          body: JSON.stringify(item.payload),
        });
        if (!res.ok) continue;
        removeQueuedAction(item.id);
        onQueueChange();
        onSetEditSynced?.(item.setId);
        syncedAny = true;
      }

      if (item.type === "delete-set") {
        const res = await apiFetch(`/sets/${item.setId}`, {
          method: "DELETE",
        });
        if (!res.ok) continue;
        removeQueuedAction(item.id);
        onQueueChange();
        onSetEditSynced?.(item.setId);
        syncedAny = true;
      }

      if (item.type === "edit-exercise") {
        const res = await apiFetch(`/exercises/${item.exerciseId}`, {
          method: "PATCH",
          body: JSON.stringify(item.payload),
        });
        if (!res.ok) continue;
        removeQueuedAction(item.id);
        onQueueChange();
        onExerciseEditSynced?.(item.exerciseId);
        syncedAny = true;
      }

      if (item.type === "delete-exercise") {
        const res = await apiFetch(`/exercises/${item.exerciseId}`, {
          method: "DELETE",
        });
        if (!res.ok) continue;
        removeQueuedAction(item.id);
        onQueueChange();
        onExerciseEditSynced?.(item.exerciseId);
        syncedAny = true;
      }
    } catch {
      // keep queued
    }
  }

  return syncedAny;
}