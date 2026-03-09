import { ExerciseEntry, SetEntry } from "@/types/workout";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  exercise: ExerciseEntry;
  cardText: string;

  handleDeleteExercise: (exerciseId: number) => Promise<void>;
  deletingExerciseById: Record<number, boolean>;

  setFormByExercise: Record<
    number,
    {
      reps: string;
      weight: string;
      time_seconds: string;
      intensity: string;
    }
  >;
  updateSetForm: (
    exerciseId: number,
    field: "reps" | "weight" | "time_seconds" | "intensity",
    value: string
  ) => void;
  handleAddSet: (e: React.FormEvent, exerciseId: number) => Promise<void>;
  addingSetByExercise: Record<number, boolean>;
  setErrorByExercise: Record<number, string | null>;

  editingSetId: number | null;
  editSetReps: string;
  setEditSetReps: (value: string) => void;
  editSetWeight: string;
  setEditSetWeight: (value: string) => void;
  editSetTimeSeconds: string;
  setEditSetTimeSeconds: (value: string) => void;
  editSetIntensity: string;
  setEditSetIntensity: (value: string) => void;
  updateSetError: string | null;
  updatingSet: boolean;
  handleUpdateSet: (e: React.FormEvent) => Promise<void>;
  startEditingSet: (set: SetEntry) => void;
  handleDeleteSet: (setId: number) => Promise<void>;
  deletingSetById: Record<number, boolean>;
  setEditingSetId: (id: number | null) => void;
  setUpdateSetError: (value: string | null) => void;
};

export default function ExerciseCard({
  exercise,
  cardText,
  handleDeleteExercise,
  deletingExerciseById,
  setFormByExercise,
  updateSetForm,
  handleAddSet,
  addingSetByExercise,
  setErrorByExercise,
  editingSetId,
  editSetReps,
  setEditSetReps,
  editSetWeight,
  setEditSetWeight,
  editSetTimeSeconds,
  setEditSetTimeSeconds,
  editSetIntensity,
  setEditSetIntensity,
  updateSetError,
  updatingSet,
  handleUpdateSet,
  startEditingSet,
  handleDeleteSet,
  deletingSetById,
  setEditingSetId,
  setUpdateSetError,
}: ExerciseCardProps) {
  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 18,
        background: "#fff",
        color: cardText,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          gap: 12,
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
          {exercise.exercise}
        </h3>

        <button
          type="button"
          onClick={() => handleDeleteExercise(exercise.id)}
          disabled={deletingExerciseById[exercise.id]}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #d0d0d0",
            background: "#fff",
            cursor: deletingExerciseById[exercise.id] ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {deletingExerciseById[exercise.id] ? "Deleting..." : "Delete Exercise"}
        </button>
      </div>

      {exercise.order_index !== undefined && (
        <p style={{ margin: "0 0 14px 0", color: "#666" }}>
          Order {exercise.order_index}
        </p>
      )}

      <section
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 14,
          marginBottom: 16,
          background: "#fcfcfc",
          color: cardText,
        }}
      >
        <h4 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px 0" }}>
          Add Set
        </h4>

        <form onSubmit={(e) => handleAddSet(e, exercise.id)} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 4 }}>
            <span>Reps</span>
            <input
              type="number"
              value={setFormByExercise[exercise.id]?.reps ?? ""}
              onChange={(e) => updateSetForm(exercise.id, "reps", e.target.value)}
              placeholder="10"
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Weight</span>
            <input
              type="number"
              value={setFormByExercise[exercise.id]?.weight ?? ""}
              onChange={(e) => updateSetForm(exercise.id, "weight", e.target.value)}
              placeholder="135"
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <button
            type="submit"
            disabled={addingSetByExercise[exercise.id]}
            style={{
              padding: 10,
              borderRadius: 8,
              border: "none",
              cursor: addingSetByExercise[exercise.id] ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
          >
            {addingSetByExercise[exercise.id] ? "Adding..." : "Add Set"}
          </button>
        </form>

        {setErrorByExercise[exercise.id] && (
          <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
            {setErrorByExercise[exercise.id]}
          </div>
        )}
      </section>

      {exercise.sets.length === 0 ? (
        <p style={{ color: "#666", marginTop: 8 }}>No sets yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {exercise.sets.map((set) => (
            <SetRow
              key={set.id}
              set={set}
              cardText={cardText}
              editingSetId={editingSetId}
              editSetReps={editSetReps}
              setEditSetReps={setEditSetReps}
              editSetWeight={editSetWeight}
              setEditSetWeight={setEditSetWeight}
              editSetTimeSeconds={editSetTimeSeconds}
              setEditSetTimeSeconds={setEditSetTimeSeconds}
              editSetIntensity={editSetIntensity}
              setEditSetIntensity={setEditSetIntensity}
              updateSetError={updateSetError}
              updatingSet={updatingSet}
              handleUpdateSet={handleUpdateSet}
              startEditingSet={startEditingSet}
              handleDeleteSet={handleDeleteSet}
              deletingSetById={deletingSetById}
              setEditingSetId={setEditingSetId}
              setUpdateSetError={setUpdateSetError}
            />
          ))}
        </div>
      )}
    </section>
  );
}