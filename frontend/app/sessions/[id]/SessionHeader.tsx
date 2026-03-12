type SessionHeaderProps = {
  split: string;
  date: string;
  notes?: string;
  cardText: string;

  isEditingSession: boolean;
  setIsEditingSession: (value: boolean) => void;

  editSplit: string;
  setEditSplit: (value: string) => void;
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
};

export default function SessionHeader({
  split,
  date,
  notes,
  cardText,
  isEditingSession,
  setIsEditingSession,
  editSplit,
  setEditSplit,
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
}: SessionHeaderProps) {
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
          flexWrap: "wrap"
        }}
      >
        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          {!isEditingSession ? (
            <>
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px 0" }}>
                {split}
              </h1>

              <p style={{ margin: "0 0 8px 0", color: "#555" }}>
                {date}
              </p>

              {notes && (
                <p style={{
                    margin: 0,
                    lineHeight: 1.5,
                    wordBreak: "break-word"
                    }}
                >
                  <strong>Notes:</strong> {notes}
                </p>
              )}
            </>
          ) : (
            <form onSubmit={handleUpdateSession} style={{ display: "grid", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span>Split</span>
                <input
                  value={editSplit}
                  onChange={(e) => setEditSplit(e.target.value)}
                  required
                  style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span>Date</span>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                  style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span>Notes</span>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
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
                  disabled={updatingSession}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #d0d0d0",
                    background: "#fff",
                    cursor: updatingSession ? "not-allowed" : "pointer",
                    fontWeight: 700,
                    color: cardText,
                  }}
                >
                  {updatingSession ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSession(false);
                    setEditSplit(split ?? "");
                    setEditDate(date ?? "");
                    setEditNotes(notes ?? "");
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
              onClick={handleDeleteSession}
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

            <button
                type="button"
                onClick={async () => {
                    await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
                    window.location.href = "/login";
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
                Log Out
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