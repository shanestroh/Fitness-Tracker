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
  const [deletingExerciseById, setDeletingExerciseById] = useState<Record<number, boolean>>({});
  const [deleteExerciseError, setDeleteExerciseError] = useState<string | null>(null);

  const [setFormByExercise, setSetFormByExercise] = useState<
    Record<
        number,
        {
            reps: string;
            weight: string;
            time_seconds: string;
            intensity: string;
        }
    >
    >({});

    const [setErrorByExercise, setSetErrorByExercise] = useState<Record<number, string | null>>({});
    const [addingSetByExercise, setAddingSetByExercise] = useState<Record<number, boolean>>({});

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

function updateSetForm(
  exerciseId: number,
  field: "reps" | "weight" | "time_seconds" | "intensity",
  value: string
) {
  setSetFormByExercise((prev) => ({
    ...prev,
    [exerciseId]: {
      reps: prev[exerciseId]?.reps ?? "",
      weight: prev[exerciseId]?.weight ?? "",
      time_seconds: prev[exerciseId]?.time_seconds ?? "",
      intensity: prev[exerciseId]?.intensity ?? "",
      [field]: value,
    },
  }));
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


async function handleAddSet(e: React.FormEvent, exerciseId: number) {
  e.preventDefault();

  setSetErrorByExercise((prev) => ({
    ...prev,
    [exerciseId]: null,
  }));

  setAddingSetByExercise((prev) => ({
    ...prev,
    [exerciseId]: true,
  }));

  const form = setFormByExercise[exerciseId] ?? {
    reps: "",
    weight: "",
    time_seconds: "",
    intensity: "",
  };

  const payload: {
    reps?: number;
    weight?: number;
    time_seconds?: number;
    intensity?: string;
  } = {};

  if (form.reps.trim()) payload.reps = Number(form.reps);
  if (form.weight.trim()) payload.weight = Number(form.weight);
  if (form.time_seconds.trim()) payload.time_seconds = Number(form.time_seconds);
  if (form.intensity.trim()) payload.intensity = form.intensity.trim();

  try {
    const res = await fetch(`http://localhost:8000/exercises/${exerciseId}/sets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to add set: ${res.status}`);
    }

    setSetFormByExercise((prev) => ({
      ...prev,
      [exerciseId]: {
        reps: "",
        weight: "",
        time_seconds: "",
        intensity: "",
      },
    }));

    await loadSession(sessionId);
  } catch (err: any) {
    setSetErrorByExercise((prev) => ({
      ...prev,
      [exerciseId]: err?.message ?? "Failed to add set",
    }));
  } finally {
    setAddingSetByExercise((prev) => ({
      ...prev,
      [exerciseId]: false,
    }));
  }
}

async function handleDeleteExercise(exerciseId: number) {
  if (!sessionId) return;

  setDeleteExerciseError(null);

  setDeletingExerciseById((prev) => ({
    ...prev,
    [exerciseId]: true,
  }));

  try {
    const res = await fetch(`http://localhost:8000/exercises/${exerciseId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to delete exercise: ${res.status}`);
    }

    await loadSession(sessionId);
  } catch (err: any) {
    setDeleteExerciseError(err?.message ?? "Failed to delete exercise");
  } finally {
    setDeletingExerciseById((prev) => ({
      ...prev,
      [exerciseId]: false,
    }));
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

       {deleteExerciseError && (
        <div style={{ color: "crimson", whiteSpace: "pre-wrap", marginBottom: 12 }}>
            {deleteExerciseError}
        </div>
        )}


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
              <div
                style = {{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                    gap: 12,
                    }}
                >
                 <h3 style = {{ fontSize: 18, fontWeight: 700, margin: 0}}>
                    {exercise.exercise}
                 </h3>

                 <button
                    type = "button"
                    onClick = {() => handleDeleteExercise(exercise.id)}
                    disabled = {deletingExerciseById[exercise.id]}
                    style = {{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        cursor: deletingExerciseById[exercise.id] ? "not-allowed" : "pointer",
                        fontWeight: 700,
                        }}
                    >
                        {deletingExerciseById[exercise.id] ? "Deleting..." : "Delete Exercise"}
                    </button>
                 </div>

              {exercise.order_index !== undefined && (
                <p style={{ marginBottom: 10 }}>
                  <strong>Order:</strong> {exercise.order_index}
                </p>
              )}

            <section
                style = {{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 12,
                marginBottom: 14,
                }}
            >
                <h4 style = {{ fontSize: 16, fontWeight: 700, marginBottom: 10}}>
                    Add Set
                </h4>

                <form onSubmit = {(e) => handleAddSet(e, exercise.id)} style = {{ display: "grid", gap: 10}}>
                    <label style = {{ display: "grid", gap: 4 }}>
                        <span>Reps</span>
                        <input
                            type = "number"
                            value = {setFormByExercise[exercise.id]?.reps ?? ""}
                            onChange = {(e) => updateSetForm(exercise.id, "reps", e.target.value)}
                            placeholder = "10"
                            style = {{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
                        />
                        </label>

                        <label style = {{ display: "grid", gap: 4}}>
                            <span>Weight</span>
                            <input
                            type = "number"
                            value = {setFormByExercise[exercise.id]?.weight ?? ""}
                            onChange = {(e) => updateSetForm(exercise.id, "weight", e.target.value)}
                            placeholder = "135"
                            style = {{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
                            />
                        </label>

                        <button
                            type = "submit"
                            disabled = {addingSetByExercise[exercise.id]}
                            style = {{
                                padding: 10,
                                borderRadius: 8,
                                border: "none",
                                cursor: addingSetByExercise[exercise.id] ? "not-allowed" : "pointer",
                                fontWeight: 700,
                                }}
                            >
                                {addingSetByExercise[exercise.id] ? "Adding..." : "Add Set"}
                            </button>
                        </form>

                        {setErrorByExercise[exercise.id] && (
                            <div style = {{ color: "crimson", whiteSpace: "pre-wrap"}}>
                                {setErrorByExercise[exercise.id]}
                            </div>
                            )}
                        </section>



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
