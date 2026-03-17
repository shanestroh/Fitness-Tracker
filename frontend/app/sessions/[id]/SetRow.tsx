import { SetEntry } from "@/types/workout";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  if (minutes > 0 && remaining > 0) {
    return `${minutes} mins ${remaining}s`;
  }
  if (minutes > 0) {
    return `${minutes} mins`;
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

function statBox(value: string | number, label: string, minWidth = 140) {
  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: 14,
        background: "var(--surface-alt)",
        border: "1px solid var(--border)",
        minWidth,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "var(--text)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 13,
          fontWeight: 700,
          color: "var(--text-muted)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

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
            display: "grid",
            gridTemplateColumns: "auto minmax(0, 1fr) auto",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              minWidth: 90,
            }}
          >
            <div
              style={{
                fontSize: 17,
                fontWeight: 900,
                color: "var(--text)",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
            >
              Set {set.set_number ?? "?"}:
            </div>

            {isPending && (
              <div style={{ marginTop: 8 }}>
                <span className="badge badge-warning">Pending sync</span>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: 0,
            }}
          >
            {exerciseType === "lift" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {set.reps !== undefined && statBox(set.reps, "reps", 120)}

                {set.reps !== undefined && set.weight !== undefined && (
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: "var(--text-muted)",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </div>
                )}

                {set.weight !== undefined && statBox(set.weight, "lbs", 120)}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    set.time_seconds !== undefined && set.intensity
                      ? "minmax(180px, 1fr) minmax(180px, 1fr)"
                      : "minmax(260px, 420px)",
                  gap: 14,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {set.time_seconds !== undefined && (
                  <div
                    style={{
                      padding: "16px 18px",
                      borderRadius: 14,
                      background: "var(--surface-alt)",
                      border: "1px solid var(--border)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "var(--text)",
                        lineHeight: 1.1,
                      }}
                    >
                      {formatTime(set.time_seconds)}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                      }}
                    >
                      time
                    </div>
                  </div>
                )}

                {set.intensity && (
                  <div
                    style={{
                      padding: "16px 18px",
                      borderRadius: 14,
                      background: "var(--surface-alt)",
                      border: "1px solid var(--border)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "var(--text)",
                        lineHeight: 1.1,
                      }}
                    >
                      {set.intensity}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                      }}
                    >
                      intensity
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
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