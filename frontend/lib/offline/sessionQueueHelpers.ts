import type { SessionFull } from "@/types/workout";
import { getOfflineQueue } from "@/lib/offline/offlineQueue";

export function getPendingQueueCount(sessionId: string): number {
  return getOfflineQueue().filter((item) => item.sessionId === sessionId).length;
}

export function applyQueuedChangesToSession(
  baseSession: SessionFull,
  currentSessionId: string
): SessionFull {
  const queue = getOfflineQueue().filter(
    (item) => item.sessionId === currentSessionId
  );

  let nextSession: SessionFull = {
    ...baseSession,
    exercises: baseSession.exercises.map((exercise) => ({
      ...exercise,
      sets: [...exercise.sets],
    })),
  };

  for (const item of queue) {
    if (item.type === "delete-exercise") {
      nextSession = {
        ...nextSession,
        exercises: nextSession.exercises.filter(
          (exercise) => exercise.id !== item.exerciseId
        ),
      };
    }
  }

  for (const item of queue) {
    if (item.type === "edit-exercise") {
      nextSession = {
        ...nextSession,
        exercises: nextSession.exercises.map((exercise) =>
          exercise.id === item.exerciseId
            ? {
                ...exercise,
                exercise: item.payload.exercise,
              }
            : exercise
        ),
      };
    }
  }

  for (const item of queue) {
    if (item.type === "delete-set") {
      nextSession = {
        ...nextSession,
        exercises: nextSession.exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets.filter((set) => set.id !== item.setId),
        })),
      };
    }
  }

  for (const item of queue) {
    if (item.type === "edit-set") {
      nextSession = {
        ...nextSession,
        exercises: nextSession.exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === item.setId
              ? {
                  ...set,
                  reps: item.payload.reps,
                  weight: item.payload.weight,
                  time_seconds: item.payload.time_seconds ?? undefined,
                  intensity: item.payload.intensity ?? undefined,
                }
              : set
          ),
        })),
      };
    }
  }

  return nextSession;
}