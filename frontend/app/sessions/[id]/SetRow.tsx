import { SetEntry } from "@/types/workout";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  if (minutes > 0 && remaining > 0) {
    return `${minutes}m ${remaining}s`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${remaining}s`;
}

type SetRowProps = {
  set: SetEntry;
  cardText: string;
  editingSetId: number | string | null;
  editSetReps: string;
  setEditSetReps: (value: string) => void;
  editSetWeight: string;
  setEditSetWeight: (value: string) => void;
  editSetTimeSeconds: string;
  setEditSetTimeSeconds: (value: string) => void;
  editSetTimeMinutes: string;
  setEditSetTimeMinutes: (value: string) => void;
  editSetIntensity: string;
  setEditSetIntensity: (value: string) => void;
  updateSetError: string | null;
  updatingSet: boolean;
  handleUpdateSet: (e: React.FormEvent) => Promise<void>;
  startEditingSet: (set: SetEntry) => void;
  handleDeleteSet: (setId: number | string) => Promise<void>;
  deletingSetById: Record<string, boolean>;
  pendingSetEditsById: Record<string, boolean>;
  setEditingSetId: (id: number | string | null) => void;
  setUpdateSetError: (value: string | null) => void;
  exerciseType: "lift" | "cardio";
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
  editSetTimeMinutes,
  setEditSetTimeMinutes,
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
  pendingSetEditsById,
  exerciseType,
}: SetRowProps) {
  const isEditing = editingSetId === set.id;
  const isDeleting = deletingSetById[String(set.id)];
  const isPending = pendingSetEditsById[String(set.id)];

  return (
    <div
      style={{
        padding: 14,
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        background: "var(--surface)",
        color: cardText,
      }}
    >
      {isEditing ? (
        <form onSubmit={handleUpdateSet} className="stack-md">
          <div>
            <div
              style={{
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 800,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Edit set
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              Set {set.set_number ?? "?"}
            </div>
          </div>

          {exerciseType === "lift" ? (
            <>
              <label className="stack-sm">
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Reps
                </span>
                <input
                  type="number"
                  value={editSetReps}
                  onChange={(e) => setEditSetReps(e.target.value)}
                />
              </label>

              <label className="stack-sm">
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Weight
                </span>
                <input
                  type="number"
                  value={editSetWeight}
                  onChange={(e) => setEditSetWeight(e.target.value)}
                />
              </label>
            </>
          ) : (
            <>
              <div className="stack-sm">
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Time
                </span>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <label className="stack-sm">
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                      }}
                    >
                      Minutes
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={editSetTimeMinutes}
                      onChange={(e) => setEditSetTimeMinutes(e.target.value)}
                    />
                  </label>

                  <label className="stack-sm">
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                      }}
                    >
                      Seconds
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={editSetTimeSeconds}
                      onChange={(e) => setEditSetTimeSeconds(e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <label className="stack-sm">
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Intensity
                </span>
                <input
                  value={editSetIntensity}
                  onChange={(e) => setEditSetIntensity(e.target.value)}
                />
              </label>
            </>
          )}

          {updateSetError && (
            <div
              style={{
                color: "var(--danger)",
                whiteSpace: "pre-wrap",
                fontWeight: 600,
              }}
            >
              {updateSetError}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={updatingSet}
              className="btn btn-primary"
            >
              {updatingSet ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingSetId(null);
                setUpdateSetError(null);
              }}
              className="btn btn-secondary"
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
          <div style={{ minWidth: 0, flex: "1 1 240px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--text)",
                }}
              >
                Set {set.set_number ?? "?"}
              </span>

              {isPending && <span className="badge badge-warning">Pending sync</span>}
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {set.reps !== undefined && (
                <span className="badge badge-neutral">{set.reps} reps</span>
              )}

              {set.weight !== undefined && (
                <span className="badge badge-neutral">{set.weight} lbs</span>
              )}

              {set.time_seconds !== undefined && (
                <span className="badge badge-neutral">
                  {formatTime(set.time_seconds)}
                </span>
              )}

              {set.intensity && (
                <span className="badge badge-neutral">{set.intensity}</span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => startEditingSet(set)}
              className="btn btn-secondary"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => handleDeleteSet(set.id)}
              disabled={isDeleting}
              className="btn btn-danger"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}