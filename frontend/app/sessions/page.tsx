export const dynamic = "force-dynamic";

import Link from "next/link";
import { apiFetch } from "@/lib/apiFetch";

type SessionSummary = {
  id: number;
  date: string;
  split: string;
  notes?: string;
  exercise_count: number;
};

async function getSessions(): Promise<SessionSummary[]> {
  try {
    const res = await apiFetch("/sessions");

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to fetch sessions:", res.status, text);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
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
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workout Sessions</h1>
          <p className="page-subtitle">
            View, manage, and continue your training history.
          </p>
        </div>

        <Link href="/sessions/new" className="btn btn-primary">
          + New Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <section
          className="section-card"
          style={{
            textAlign: "center",
            padding: "32px 20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "var(--text)",
            }}
          >
            No sessions yet
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              color: "var(--text-muted)",
              fontSize: 15,
            }}
          >
            Create your first workout session to start tracking progress.
          </p>

          <div style={{ marginTop: 18 }}>
            <Link href="/sessions/new" className="btn btn-primary">
              Create First Session
            </Link>
          </div>
        </section>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="surface-card"
              style={{
                display: "block",
                padding: 18,
                textDecoration: "none",
                transition:
                  "transform 0.08s ease, box-shadow 0.15s ease, border-color 0.15s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 0, flex: "1 1 260px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                      marginBottom: 8,
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 22,
                        lineHeight: 1.2,
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: "var(--text)",
                      }}
                    >
                      {session.split}
                    </h2>

                    <span className="badge badge-neutral">
                      {session.exercise_count}{" "}
                      {session.exercise_count === 1 ? "exercise" : "exercises"}
                    </span>
                  </div>

                  {session.notes ? (
                    <p
                      style={{
                        margin: 0,
                        color: "var(--text-muted)",
                        fontSize: 15,
                        lineHeight: 1.5,
                      }}
                    >
                      {session.notes}
                    </p>
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        color: "var(--text-muted)",
                        fontSize: 15,
                      }}
                    >
                      No notes added
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    justifyItems: "end",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(session.date)}
                  </span>

                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--primary)",
                    }}
                  >
                    Open session →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}