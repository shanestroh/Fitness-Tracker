type SetEntry = {
  id: number;
  set_number?: number;
  reps?: number;
  weight?: number;
  time_seconds?: number;
  intensity?: string;
};

type SetRowProps = {
  set: SetEntry;
  cardText: string;
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

export default function SetRow({
  set,
  cardText,
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
}: SetRowProps) {
  return (
    <div
      style={{
        padding: "12px 14px",
        border: "1px solid #eee",
        borderRadius: 10,
        background: "#fafafa",
        color: cardText,
      }}
    >
      {editingSetId === set.id ? (
        <form onSubmit={handleUpdateSet} style={{ display: "grid", gap: 10 }}>
          <div style={{ fontWeight: 700 }}>Edit Set {set.set_number ?? "?"}</div>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Reps</span>
            <input
              type="number"
              value={editSetReps}
              onChange={(e) => setEditSetReps(e.target.value)}
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Weight</span>
            <input
              type="number"
              value={editSetWeight}
              onChange={(e) => setEditSetWeight(e.target.value)}
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Time in seconds</span>
            <input
              type="number"
              value={editSetTimeSeconds}
              onChange={(e) => setEditSetTimeSeconds(e.target.value)}
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Intensity</span>
            <input
              value={editSetIntensity}
              onChange={(e) => setEditSetIntensity(e.target.value)}
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          {updateSetError && (
            <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
              {updateSetError}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="submit"
              disabled={updatingSet}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: updatingSet ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {updatingSet ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingSetId(null);
                setUpdateSetError(null);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <strong>Set {set.set_number ?? "?"}:</strong>
            <span style={{ marginLeft: 12 }}>
              {set.reps !== undefined ? `${set.reps} reps` : ""}
              {set.weight !== undefined ? ` @ ${set.weight} lb` : ""}
              {set.time_seconds !== undefined ? ` · ${set.time_seconds}s` : ""}
              {set.intensity ? ` · ${set.intensity}` : ""}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => startEditingSet(set)}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Edit Set
            </button>

            <button
              type="button"
              onClick={() => handleDeleteSet(set.id)}
              disabled={deletingSetById[set.id]}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: deletingSetById[set.id] ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {deletingSetById[set.id] ? "Deleting..." : "Delete Set"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}