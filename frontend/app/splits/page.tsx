export const dynamic = "force-dynamic";

import { apiFetch } from "@/lib/apiFetch";
import EmptyState from "@/app/components/EmptyState";
import ErrorState from "@/app/components/ErrorState";
import SplitCard from "@/app/components/SplitCard";

type SessionSummary = {
  id: number;
  date: string;
  split: string;
  notes?: string;
  exercise_count: number;
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
      console.error("Failed to fetch sessions:", res.status, text);
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
    console.error("Error fetching sessions:", error);
    return {
      sessions: [],
      error: error?.message ?? "Failed to load splits",
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

export default async function SplitsPage() {
  const { sessions, error } = await getSessions();

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

  const splitEntries = Object.entries(grouped)
    .map(([splitKey, splitSessions]) => {
      const sortedSessions = [...splitSessions].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      return [splitKey, sortedSessions] as const;
    })
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Splits</h1>
          <p className="page-subtitle">
            Explore your workout history by training split.
          </p>
        </div>
      </div>

      {error ? (
        <ErrorState title="Could not load splits" message={error} />
      ) : splitEntries.length === 0 ? (
        <EmptyState
          title="No splits yet"
          description="Once you create workout sessions, your splits will appear here automatically."
        />
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {splitEntries.map(([splitKey, splitSessions]) => (
            <SplitCard
              key={splitKey}
              splitKey={splitKey}
              splitName={formatSplitName(splitKey)}
              sessionCount={splitSessions.length}
              lastWorkoutDate={splitSessions[0].date}
            />
          ))}
        </div>
      )}
    </main>
  );
}