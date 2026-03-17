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

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

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
      className="section-card"
      style={{
        marginBottom: 24,
        color: cardText,
      }}
    >
      {!isEditingSession ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 260px", minWidth: 0 }}>
              <div style={{ marginBottom: 10 }}>
                <h1
                  className="section-heading"
                  style={{
                    fontSize: 32,
                    lineHeight: 1.1,
                  }}
                >
                  {split}
                </h1>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "var(--text-muted)",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {formatDate(date)}
              </p>

              {notes ? (
                <div className="subtle-panel" style={{ marginTop: 16, padding: 14 }}>
                  <div className="eyebrow">Notes</div>

                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.6,
                      color: "var(--text)",
                      wordBreak: "break-word",
                    }}
                  >
                    {notes}
                  </p>
                </div>
              ) : (
                <p className="muted-copy" style={{ margin: "14px 0 0" }}>
                  No notes added for this session.
                </p>
              )}
            </div>

            <div className="action-row">
              <button
                type="button"
                onClick={() => {
                  setIsEditingSession(true);
                  setUpdateSessionError(null);
                }}
                className="btn btn-secondary"
              >
                Edit Session
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteSessionModal(true)}
                disabled={deletingSession}
                className="btn btn-danger"
              >
                {deletingSession ? "Deleting..." : "Delete Session"}
              </button>
            </div>
          </div>

          {deleteSessionError && (
            <div className="danger-text" style={{ marginTop: 14 }}>
              {deleteSessionError}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleUpdateSession} className="stack-md">
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Edit session
            </div>

            <h2
              className="section-heading"
              style={{
                fontSize: 26,
              }}
            >
              Update workout details
            </h2>
          </div>

          <SplitSelector
            splitOption={editSplitOption}
            setSplitOption={setEditSplitOption}
            customSplit={editCustomSplit}
            setCustomSplit={setEditCustomSplit}
          />

          <label className="stack-sm">
            <span className="field-label">Date</span>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              required
            />
          </label>

          <label className="stack-sm">
            <span className="field-label">Notes</span>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={4}
              placeholder="Optional notes for this workout"
            />
          </label>

          {updateSessionError && (
            <div className="danger-text">{updateSessionError}</div>
          )}

          <div className="action-row">
            <button
              type="submit"
              disabled={
                updatingSession ||
                (editSplitOption === "Other" && !editCustomSplit.trim())
              }
              className="btn btn-primary"
            >
              {updatingSession ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={resetEditForm}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}