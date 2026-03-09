type AddExerciseFormProps = {
  exerciseName: string;
  setExerciseName: (value: string) => void;
  orderIndex: string;
  setOrderIndex: (value: string) => void;
  handleAddExercise: (e: React.FormEvent) => Promise<void>;
  addingExercise: boolean;
  exerciseError: string | null;
  cardText: string;
};

export default function AddExerciseForm({
  exerciseName,
  setExerciseName,
  orderIndex,
  setOrderIndex,
  handleAddExercise,
  addingExercise,
  exerciseError,
  cardText,
}: AddExerciseFormProps) {
  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 18,
        marginBottom: 28,
        background: "#fff",
        color: cardText,
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Add Exercise
      </h2>

      <form onSubmit={handleAddExercise} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Exercise name</span>
          <input
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="Bench Press"
            required
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Order index (optional)</span>
          <input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
            placeholder="Leave blank to auto-assign"
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        {exerciseError && (
          <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
            {exerciseError}
          </div>
        )}

        <button
          type="submit"
          disabled={addingExercise}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "none",
            cursor: addingExercise ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          {addingExercise ? "Adding..." : "Add Exercise"}
        </button>
      </form>
    </section>
  );
}