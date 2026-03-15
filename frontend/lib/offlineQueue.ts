export type PendingAddSetAction = {
  id: string;
  type: "add-set";
  sessionId: string;
  exerciseId: number;
  tempSetId: string;
  payload: {
    reps?: number;
    weight?: number;
    time_seconds?: number;
    intensity?: string;
  };
  createdAt: number;
};

const STORAGE_KEY = "fitness_tracker_offline_queue";

function readQueue(): PendingAddSetAction[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PendingAddSetAction[];
  } catch {
    return [];
  }
}

function writeQueue(queue: PendingAddSetAction[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function getOfflineQueue(): PendingAddSetAction[] {
  return readQueue();
}

export function enqueueAddSetAction(action: PendingAddSetAction) {
  const queue = readQueue();
  queue.push(action);
  writeQueue(queue);
}

export function removeQueuedAction(actionId: string) {
  const queue = readQueue().filter((item) => item.id !== actionId);
  writeQueue(queue);
}

export function removeQueuedAddSetByTempId(tempSetId: string) {
  const queue = readQueue().filter(
    (item) => !(item.type === "add-set" && item.tempSetId === tempSetId)
  );
  writeQueue(queue);
}

export function getQueuedAddSetCountForSession(sessionId: string) {
  return readQueue().filter(
    (item) => item.type === "add-set" && item.sessionId === sessionId
  ).length;
}