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

type Props = {
  params: Promise<{
    splitName: string;
  }>;
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

function normalizeSplit(split: string) {
  return split.trim().toLowerCase();
}

function formatSplitName(split: string) {
  if (!split) return "Other";
  return split.charAt(0).toUpperCase() + split.slice(1);
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

export default async function SplitDetailPage({ params }: Props) {
  const { splitName } = await params;
  const decodedSplitName = decodeURIComponent(splitName);

  const sessions = await getSessions();

  const filteredSessions = sessions.filter(
    (session) => normalizeSplit(session.split || "Other") === decodedSplitName
  );

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
        {formatSplitName(decodedSplitName)} Workouts
      </h1>

      {filteredSessions.length === 0 ? (
        <p>No workouts found for this split.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filteredSessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              style={{
                display: "block",
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                textDecoration: "none",
                color: "inherit",
                background: "#fff",
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