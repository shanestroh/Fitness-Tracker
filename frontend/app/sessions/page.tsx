export const dynamic = "force-dynamic";

import Link from "next/link";
import { apiFetch } from "@/lib/apiFetch";
import EmptyState from "@/app/components/EmptyState";
import SessionCard from "@/app/components/SessionCard";

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
        <EmptyState
          title="No sessions yet"
          description="Create your first workout session to start tracking your progress."
          action={
            <Link href="/sessions/new" className="btn btn-primary">
              Create First Session
            </Link>
          }
        />
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              id={session.id}
              split={session.split}
              date={session.date}
              notes={session.notes}
              exerciseCount={session.exercise_count}
            />
          ))}
        </div>
      )}
    </main>
  );
}