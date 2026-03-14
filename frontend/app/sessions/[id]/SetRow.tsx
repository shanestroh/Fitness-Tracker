import { SetEntry } from "@/types/workout";

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
  handleDeleteSet: (setId: number | string) => Promise<void>;
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
        padding: "14px 16px",
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        background: "#fff",
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
              style={{
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 8,
                background: "#fff",
                color: "#111",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Weight</span>
            <input
              type="number"
              value={editSetWeight}
              onChange={(e) => setEditSetWeight(e.target.value)}
              style={{
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 8,
                background: "#fff",
                color: "#111",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Time in seconds</span>
            <input
              type="number"
              value={editSetTimeSeconds}
              onChange={(e) => setEditSetTimeSeconds(e.target.value)}
              style={{
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 8,
                background: "#fff",
                color: "#111",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Intensity</span>
            <input
              value={editSetIntensity}
              onChange={(e) => setEditSetIntensity(e.target.value)}
              style={{
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 8,
                background: "#fff",
                color: "#111",
              }}
            />
          </label>

          {updateSetError && (
            <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
              {updateSetError}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={updatingSet}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                cursor: updatingSet ? "not-allowed" : "pointer",
                fontWeight: 700,
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
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #d0d0d0",
                background: "#fff",
                color: "#111",
                cursor: "pointer",
                fontWeight: 700,
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
            flexWrap: "wrap",
          }}
        >
          <div>
            <strong>Set {set.set_number ?? "?"}:</strong>
            <span style={{ marginLeft: 12 }}>
              {set.reps !== undefined ? `${set.reps} reps` : ""}
              {set.weight !== undefined ? ` x ${set.weight} lbs` : ""}
              {set.time_seconds !== undefined ? ` · ${set.time_seconds}s` : ""}
              {set.intensity ? ` · ${set.intensity}` : ""}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => startEditingSet(set)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #d0d0d0",
                background: "#fff",
                color: "#111",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Edit Set
            </button>

            <button
              type="button"
              onClick={() => handleDeleteSet(set.id)}
              disabled={deletingSetById[set.id]}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #f0b8c1",
                background: "#fff",
                color: "#b00020",
                cursor: deletingSetById[set.id] ? "not-allowed" : "pointer",
                fontWeight: 700,
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