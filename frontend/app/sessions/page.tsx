type SessionSummary = {
  id: number;
  date: string;
  split: string;
  notes?: string;
  exercise_count: number;
};

async function getSessions(): Promise<SessionSummary[]> {
  const res = await fetch("http://localhost:8000/sessions", {
    cache: "no-store",
    headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch sessions: ${res.status}`);
  }

  return res.json();
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${month} ${day}${suffix}, ${year}`;
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
              <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: session.notes ? 6 : 0,
                    gap: 12,
                }}
                >
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                    {session.split}
                    <span style ={{ fontSize: 14, fontWeight: 500, color: "#aaa", marginLeft: 8}}>
                    {session.exercise_count} {session.exercise_count === 1 ? "Exercise" : "Exercises"}
                    </span>
                </h2>

                <span style={{ color: "#999", fontSize: 14, whiteSpace: "nowrap" }}>
                    {formatDate(session.date)}
                </span>
            </div>

            {session.notes && (
                <p style={{ margin: 0, color: "#bbb" }}>
                    {session.notes}
                </p>
                )}
            </a>
          ))}
        </div>
      )}
    </main>
  );
}