"use client";

import { useEffect, useState } from "react";

type SetEntry = {
    id: number;
    set_number?: number;
    reps?: number;
    weight?: number;
    time_seconds?: number;
    intensity?: string;
    };

type ExerciseEntry = {
  id: number;
  exercise: string;
  order_index?: number;
  sets: SetEntry[];
};

type SessionFull = {
  id: number;
  date: string;
  split: string;
  notes?: string;
  exercises: ExerciseEntry[];
};

type SessionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function SessionPage({ params }: SessionPageProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const [session, setSession] = useState<SessionFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [exerciseName, setExerciseName] = useState("");
  const [orderIndex, setOrderIndex] = useState("");
  const [addingExercise, setAddingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState<string | null>(null);

  async function loadSession(id: string) {
    setLoading(true);
    setPageError(null);

    try {
      const res = await fetch(`http://localhost:8000/sessions/${id}/full`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch session: ${res.status}`);
      }

      const data = await res.json();
      setSession(data);
    } catch (err: any) {
      setPageError(err?.message ?? "Failed to load session");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setSessionId(resolvedParams.id);
      await loadSession(resolvedParams.id);
    }

    unwrapParams();
  }, [params]);

  async function handleAddExercise(e: React.FormEvent) {
    e.preventDefault();

    if (!sessionId) return;

    setExerciseError(null);
    setAddingExercise(true);

    const payload = {
      exercise: exerciseName,
      order_index: orderIndex.trim() ? Number(orderIndex) : null,
    };

    try {
      const res = await fetch(`http://localhost:8000/sessions/${sessionId}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to add exercise: ${res.status}`);
      }

      setExerciseName("");
      setOrderIndex("");

      await loadSession(sessionId);
    } catch (err: any) {
      setExerciseError(err?.message ?? "Failed to add exercise");
    } finally {
      setAddingExercise(false);
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
        <p>Loading session...</p>
      </main>
    );
  }

  if (pageError || !session) {
    return (
      <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
        <h1>Session Detail</h1>
        <p style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
          {pageError ?? "Session not found"}
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <a
        href="/sessions"
        style={{
          display: "inline-block",
          marginBottom: 16,
          textDecoration: "none",
        }}
      >
        ← Back to Sessions
      </a>

      <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
        {session.split}
      </h1>

      <p style={{ marginBottom: 8 }}>
        <strong>Date:</strong> {session.date}
      </p>

      {session.notes && (
        <p style={{ marginBottom: 20 }}>
          <strong>Notes:</strong> {session.notes}
        </p>
      )}

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
          Add Exercise
        </h2>

        <form onSubmit={handleAddExercise} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Exercise name</span>
            <input
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="Bench Press"
              required
              style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Order index (optional)</span>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(e.target.value)}
              placeholder="Leave blank to auto-assign"
              style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          {exerciseError && (
            <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
              {exerciseError}
            </div>
          )}

          <button
            type="submit"
            disabled={addingExercise}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "none",
              cursor: addingExercise ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
          >
            {addingExercise ? "Adding..." : "Add Exercise"}
          </button>
        </form>
      </section>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Exercises
      </h2>

      {session.exercises.length === 0 ? (
        <p>No exercises yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {session.exercises.map((exercise) => (
            <section
              key={exercise.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
                {exercise.exercise}
              </h3>

              {exercise.order_index !== undefined && (
                <p style={{ marginBottom: 10 }}>
                  <strong>Order:</strong> {exercise.order_index}
                </p>
              )}

              {exercise.sets.length === 0 ? (
                <p>No sets yet.</p>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {exercise.sets.map((set) => (
                    <div
                      key={set.id}
                      style={{
                        padding: 10,
                        border: "1px solid #eee",
                        borderRadius: 8,
                      }}
                    >
                      <div>
                        <strong>Set {set.set_number ?? "?"}</strong>
                      </div>
                      {set.reps !== undefined && <div>Reps: {set.reps}</div>}
                      {set.weight !== undefined && <div>Weight: {set.weight}</div>}
                      {set.time_seconds !== undefined && (
                        <div>Time: {set.time_seconds}s</div>
                      )}
                      {set.intensity && <div>Intensity: {set.intensity}</div>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
