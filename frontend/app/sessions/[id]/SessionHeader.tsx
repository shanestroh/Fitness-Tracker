"use client";

import SplitSelector from "@/app/components/SplitSelector";

const PRESET_SPLITS = ["Push", "Pull", "Legs", "Shoulders", "Cardio"];

type SessionHeaderProps = {
  split: string;
  date: string;
  notes?: string;
  cardText: string;

  isEditingSession: boolean;
  setIsEditingSession: (value: boolean) => void;

  editSplitOption: string;
  setEditSplitOption: (value: string) => void;
  editCustomSplit: string;
  setEditCustomSplit: (value: string) => void;

  editDate: string;
  setEditDate: (value: string) => void;
  editNotes: string;
  setEditNotes: (value: string) => void;

  updatingSession: boolean;
  updateSessionError: string | null;
  handleUpdateSession: (e: React.FormEvent) => Promise<void>;
  setUpdateSessionError: (value: string | null) => void;

  deletingSession: boolean;
  deleteSessionError: string | null;
  handleDeleteSession: () => Promise<void>;
  setShowDeleteSessionModal: (value: boolean) => void;
};

export default function SessionHeader({
  split,
  date,
  notes,
  cardText,
  isEditingSession,
  setIsEditingSession,
  editSplitOption,
  setEditSplitOption,
  editCustomSplit,
  setEditCustomSplit,
  editDate,
  setEditDate,
  editNotes,
  setEditNotes,
  updatingSession,
  updateSessionError,
  handleUpdateSession,
  setUpdateSessionError,
  deletingSession,
  deleteSessionError,
  handleDeleteSession,
  setShowDeleteSessionModal,
}: SessionHeaderProps) {
  function resetEditForm() {
    const isPresetSplit = PRESET_SPLITS.includes(split);

    setIsEditingSession(false);
    setEditSplitOption(isPresetSplit ? split : "Other");
    setEditCustomSplit(isPresetSplit ? "" : split);
    setEditDate(date ?? "");
    setEditNotes(notes ?? "");
    setUpdateSessionError(null);
  }

  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        background: "#fafafa",
        color: cardText,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          {!isEditingSession ? (
            <>
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px 0" }}>
                {split}
              </h1>

              <p style={{ margin: "0 0 8px 0", color: "#555" }}>{date}</p>

              {notes && (
                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                  }}
                >
                  <strong>Notes:</strong> {notes}
                </p>
              )}
            </>
          ) : (
            <form onSubmit={handleUpdateSession} style={{ display: "grid", gap: 12 }}>
              <SplitSelector
                splitOption={editSplitOption}
                setSplitOption={setEditSplitOption}
                customSplit={editCustomSplit}
                setCustomSplit={setEditCustomSplit}
              />

              <label style={{ display: "grid", gap: 6 }}>
                <span>Date</span>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                  style={{
                    padding: 10,
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    background: "#fff",
                    color: "#111",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span>Notes</span>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  style={{
                    padding: 10,
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    background: "#fff",
                    color: "#111",
                  }}
                />
              </label>

              {updateSessionError && (
                <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
                  {updateSessionError}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={
                    updatingSession ||
                    (editSplitOption === "Other" && !editCustomSplit.trim())
                  }
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #d0d0d0",
                    background: "#fff",
                    cursor:
                      updatingSession ||
                      (editSplitOption === "Other" && !editCustomSplit.trim())
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: 700,
                    color: cardText,
                  }}
                >
                  {updatingSession ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={resetEditForm}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #d0d0d0",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: 700,
                    color: cardText,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {!isEditingSession && (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => {
                setIsEditingSession(true);
                setUpdateSessionError(null);
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #d0d0d0",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 700,
                color: cardText,
              }}
            >
              Edit Session
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteSessionModal(true)}
              disabled={deletingSession}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #d0d0d0",
                background: "#fff",
                cursor: deletingSession ? "not-allowed" : "pointer",
                fontWeight: 700,
                color: cardText,
              }}
            >
              {deletingSession ? "Deleting..." : "Delete Session"}
            </button>
          </div>
        )}
      </div>

      {deleteSessionError && (
        <div style={{ color: "crimson", whiteSpace: "pre-wrap", marginTop: 12 }}>
          {deleteSessionError}
        </div>
      )}
    </section>
  );
}