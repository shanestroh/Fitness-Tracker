import type { SessionFull } from "@/types/workout";

export function addOptimisticExercise(
  session: SessionFull,
  optimisticExercise: SessionFull["exercises"][number]
): SessionFull {
  return {
    ...session,
    exercises: [...session.exercises, optimisticExercise],
  };
}

export function removeExerciseFromSession(
  session: SessionFull,
  exerciseId: number
): SessionFull {
  return {
    ...session,
    exercises: session.exercises.filter((exercise) => exercise.id !== exerciseId),
  };
}

export function addOptimisticSet(
  session: SessionFull,
  exerciseId: number,
  optimisticSet: SessionFull["exercises"][number]["sets"][number]
): SessionFull {
  return {
    ...session,
    exercises: session.exercises.map((exercise) =>
      exercise.id === exerciseId
        ? { ...exercise, sets: [...exercise.sets, optimisticSet] }
        : exercise
    ),
  };
}

export function removeSetFromSession(
  session: SessionFull,
  setId: number | string
): SessionFull {
  return {
    ...session,
    exercises: session.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.filter((set) => set.id !== setId),
    })),
  };
}

export function updateSetInSession(
  session: SessionFull,
  setId: number | string,
  updates: {
    reps?: number;
    weight?: number;
    time_seconds?: number | null;
    intensity?: string | null;
  }
): SessionFull {
  return {
    ...session,
    exercises: session.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) =>
        set.id === setId
          ? {
              ...set,
              reps: updates.reps,
              weight: updates.weight,
              time_seconds: updates.time_seconds ?? undefined,
              intensity: updates.intensity ?? undefined,
            }
          : set
      ),
    })),
  };
}

export function updateExerciseNameInSession(
  session: SessionFull,
  exerciseId: number,
  newName: string
): SessionFull {
  return {
    ...session,
    exercises: session.exercises.map((exercise) =>
      exercise.id === exerciseId
        ? { ...exercise, exercise: newName }
        : exercise
    ),
  };
}