export const dynamic = "force-dynamic";

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

type Props = {
  params: Promise<{
    splitName: string;
  }>;
};

type SessionsResult = {
  sessions: SessionSummary[];
  error: string | null;
};

async function getSessions(): Promise<SessionsResult> {
  try {
    const res = await apiFetch("/sessions");

    if (!res.ok) {
      const text = await res.text();
      return {
        sessions: [],
        error: text || `Failed to fetch sessions: ${res.status}`,
      };
    }

    return {
      sessions: await res.json(),
      error: null,
    };
  } catch (error: any) {
    return {
      sessions: [],
      error: error?.message ?? "Failed to load sessions",
    };
  }
}

function normalizeSplit(split: string) {
  return split.trim().toLowerCase();
}

function formatSplitName(split: string) {
  if (!split) return "Other";
  return split.charAt(0).toUpperCase() + split.slice(1);
}

export default async function SplitDetailPage({ params }: Props) {
  const { splitName } = await params;
  const decodedSplitName = decodeURIComponent(splitName);

  const sessions = await getSessions();

  const filteredSessions = sessions
    .filter(
      (session) => normalizeSplit(session.split || "Other") === decodedSplitName
    )
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const prettySplitName = formatSplitName(decodedSplitName);

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">{prettySplitName} Workouts</h1>
          <p className="page-subtitle">
            View all sessions logged under the {prettySplitName} split.
          </p>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <EmptyState
          title="No workouts found"
          description={`There are no sessions saved under the ${prettySplitName} split yet.`}
        />
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {filteredSessions.map((session) => (
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