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

export default async function SplitsPage() {
  const sessions = await getSessions();

  const grouped = sessions.reduce(
    (acc, session) => {
      const key = normalizeSplit(session.split || "Other");

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(session);
      return acc;
    },
    {} as Record<string, SessionSummary[]>
  );

  const splitEntries = Object.entries(grouped).sort((a, b) => {
    return b[1].length - a[1].length;
  });

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
        Browse by Split
      </h1>

      {splitEntries.length === 0 ? (
        <p>No splits yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {splitEntries.map(([splitKey, splitSessions]) => (
            <Link
              key={splitKey}
              href={`/splits/${encodeURIComponent(splitKey)}`}
              style={{
                display: "block",
                padding: 16,
                border: "1px solid #ddd",
                borderRadius: 12,
                textDecoration: "none",
                background: "#fff",
                color: "#111",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
                  {formatSplitName(splitKey)}
                </h2>

                <span style={{ color: "#666", fontSize: 14 }}>
                  {splitSessions.length}{" "}
                  {splitSessions.length === 1 ? "Workout" : "Workouts"}
                </span>
              </div>

              <p style={{ margin: "8px 0 0", color: "#555" }}>
                Last workout: {formatDate(splitSessions[0].date)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}