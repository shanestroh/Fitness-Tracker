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

export type PendingAddExerciseAction = {
  id: string;
  type: "add-exercise";
  sessionId: string;
  tempExerciseId: number;
  payload: {
    exercise: string;
  };
  createdAt: number;
};

export type PendingEditSetAction = {
  id: string;
  type: "edit-set";
  sessionId: string;
  setId: number;
  payload: {
    reps?: number;
    weight?: number;
    time_seconds?: number | null;
    intensity?: string | null;
  };
  createdAt: number;
};

export type OfflineQueueItem =
  | PendingAddSetAction
  | PendingAddExerciseAction
  | PendingEditSetAction;

const STORAGE_KEY = "fitness_tracker_offline_queue";

function readQueue(): OfflineQueueItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OfflineQueueItem[];
  } catch {
    return [];
  }
}

function writeQueue(queue: OfflineQueueItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function getOfflineQueue(): OfflineQueueItem[] {
  return readQueue();
}

export function enqueueAddSetAction(action: PendingAddSetAction) {
  const queue = readQueue();
  queue.push(action);
  writeQueue(queue);
}

export function enqueueAddExerciseAction(action: PendingAddExerciseAction) {
  const queue = readQueue();
  queue.push(action);
  writeQueue(queue);
}

export function enqueueOrReplaceEditSetAction(action: PendingEditSetAction) {
  const queue = readQueue();

  const existingIndex = queue.findIndex(
    (item) =>
      item.type === "edit-set" &&
      item.sessionId === action.sessionId &&
      item.setId === action.setId
  );

  if (existingIndex >= 0) {
    queue[existingIndex] = {
      ...queue[existingIndex],
      payload: action.payload,
      createdAt: action.createdAt,
    } as PendingEditSetAction;
  } else {
    queue.push(action);
  }

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

export function removeQueuedAddExerciseByTempId(tempExerciseId: number) {
  const queue = readQueue().filter(
    (item) =>
      !(item.type === "add-exercise" && item.tempExerciseId === tempExerciseId)
  );
  writeQueue(queue);
}