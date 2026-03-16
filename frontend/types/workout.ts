export type SetEntry = {
  id: number | string;
  set_number?: number;
  reps?: number;
  weight?: number;
  time_seconds?: number;
  intensity?: string;
};

export type ExerciseEntry = {
  id: number;
  exercise: string;
  exercise_type: "lift" | "cardio";
  order_index?: number;
  sets: SetEntry[];
};

export type SessionFull = {
  id: number;
  date: string;
  split: string;
  notes?: string;
  exercises: ExerciseEntry[];
};