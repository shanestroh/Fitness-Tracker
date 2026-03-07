type SessionSummary = {
  id: number;
  date: string;
  split: string;
  notes?: string;
};

async function getSessions(): Promise<SessionSummary[]> {
  const res = await fetch("http://localhost:8000/sessions", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch sessions: ${res.status}`);
  }

  return res.json();
}

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: 700 }}>Workout Sessions</h1>
        <a
          href="/sessions/new"
          style={{
            padding: "10px 14px",
            border: "1px solid #ccc",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          + New Session
        </a>
      </div>

      {sessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {sessions.map((session) => (
            <a
              key={session.id}
              href={`/sessions/${session.id}`}
              style={{
                display: "block",
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                {session.split}
              </h2>
              <p style={{ marginBottom: 6 }}>
                <strong>Date:</strong> {session.date}
              </p>
              {session.notes && <p>{session.notes}</p>}
            </a>
          ))}
        </div>
      )}
    </main>
  );
}