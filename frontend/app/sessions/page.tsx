export const dynamic = "force-dynamic";

import Link from "next/link";
import { apiFetch } from "@/lib/apiFetch";
import { useIdleLogout } from "@/hooks/useIdleLogout";

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
  useIdleLogout();
  const sessions = await getSessions();

  return (
    <main style={{ maxWidth: 700, margin: "32px auto", padding: "0 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
            Workout Sessions
        </h1>

        <Link
          href="/sessions/new"
          style={{
            padding: "12px 16px",
            border: "1px solid #111",
            borderRadius: 10,
            textDecoration: "none",
            background: "#111",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          + New Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              style={{
                display: "block",
                border: "1px solid #e5e5e5",
                borderRadius: 16,
                padding: 18,
                textDecoration: "none",
                color: "inherit",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: session.notes ? 6 : 0,
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
                  {session.split}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#666",
                      marginLeft: 8,
                    }}
                  >
                    {session.exercise_count}{" "}
                    {session.exercise_count === 1 ? "Exercise" : "Exercises"}
                  </span>
                </h2>

                <span
                  style={{ color: "#666", fontSize: 14, whiteSpace: "nowrap" }}
                >
                  {formatDate(session.date)}
                </span>
              </div>

              {session.notes && (
                <p style={{ margin: 0, color: "#555" }}>{session.notes}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}