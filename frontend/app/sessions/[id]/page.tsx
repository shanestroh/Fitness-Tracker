"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
  const [deletingSetById, setDeletingSetById] = useState<Record<number, boolean>>({});
  const [deleteSetError, setDeleteSetError] = useState<string | null>(null);
  const [deletingSession, setDeletingSession] = useState(false);
  const [deleteSessionError, setDeleteSessionError] = useState<string | null>(null);
  const cardText = "#111";

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

async function handleDeleteSet(setId: number) {
  if (!sessionId) return;

  setDeleteSetError(null);

  setDeletingSetById((prev) => ({
    ...prev,
    [setId]: true,
  }));

  try {
    const res = await fetch(`http://localhost:8000/sets/${setId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to delete set: ${res.status}`);
    }

    await loadSession(sessionId);
  } catch (err: any) {
    setDeleteSetError(err?.message ?? "Failed to delete set");
  } finally {
    setDeletingSetById((prev) => ({
      ...prev,
      [setId]: false,
    }));
  }
}

async function handleDeleteSession() {
  if (!sessionId) return;

  const confirmed = window.confirm("Are you sure you want to delete this session?");
  if (!confirmed) return;

  setDeleteSessionError(null);
  setDeletingSession(true);

  try {
    const res = await fetch(`http://localhost:8000/sessions/${sessionId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to delete session: ${res.status}`);
    }

    router.push("/sessions");
  } catch (err: any) {
    setDeleteSessionError(err?.message ?? "Failed to delete session");
  } finally {
    setDeletingSession(false);
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

      <section
        style = {{
            border: "1px solid #ddd",
            borderRadius: 16,
            padding: 20,
            marginBottom:24,
            background: "#fafafa",
            color: cardText,
            }}
        >
        <div
            style = {{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                marginBottom: 8,
                }}
            >
            <div>
        <h1 style = {{ fontSize: 32, fontWeight: 800, margin: "0 0 8px 0"}}>
            {session.split}
            </h1>

        <p style = {{ margin: "0 0 8px 0", color: "#555" }}>
            {session.date}
        </p>

        </div>

        <button
            type = "button"
            onClick = {handleDeleteSession}
            disabled = {deletingSession}
            style = {{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #d0d0d0",
                background: "#fff",
                cursor: deletingSession ? "not-allowed" : "pointer",
                fontWeight: 700,
                color: cardText,
                }}
            >
                {deletingSession ? "Deleting..." : "Delete Session"}
                </button>
                </div>

            {session.notes && (
                <p style = {{ margin: 0, lineHeight: 1.5}}>
                    <strong>Notes:</strong> {session.notes}
                </p>
                )}
            {deleteSessionError && (
                <div style = {{ color: "crimson", whiteSpace: "pre-wrap", marginTop: 12 }}>
                    {deleteSessionError}
                </div>
                )}
            </section>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 16,
          padding: 18,
          marginBottom: 28,
          background: "#fff",
          color: cardText,
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

        {deleteSetError && (
            <div style = {{ color : "crimson", whiteSpace: "pre-wrap", marginBottom: 12}}>
            {deleteSetError}
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
                borderRadius: 16,
                padding: 18,
                background: "#fff",
                color: cardText,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
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
                 <h3 style = {{ fontSize: 20, fontWeight: 700, margin: 0}}>
                    {exercise.exercise}
                 </h3>

                 <button
                    type = "button"
                    onClick = {() => handleDeleteExercise(exercise.id)}
                    disabled = {deletingExerciseById[exercise.id]}
                    style = {{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #d0d0d0",
                        background: "#fff",
                        cursor: deletingExerciseById[exercise.id] ? "not-allowed" : "pointer",
                        fontWeight: 600,
                        }}
                    >
                        {deletingExerciseById[exercise.id] ? "Deleting..." : "Delete Exercise"}
                    </button>
                 </div>

              {exercise.order_index !== undefined && (
                  <p style = {{ margin: "0 0 14px 0", color: "#666" }}>
                    Order {exercise.order_index}
                </p>
              )}

            <section
                style = {{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
                background: "#fcfcfc",
                color: cardText,
                }}
            >
                <h4 style = {{ fontSize: 16, fontWeight: 700, margin: "0 0 12px 0"}}>
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
                <p style = {{ color: "#666", marginTop: 8 }}>No sets yet.</p>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {exercise.sets.map((set) => (
                    <div
                      key= {set.id}
                      style={{
                        padding: "12px 14px",
                        border: "1px solid #eee",
                        borderRadius: 10,
                        background: "#fafafa",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                      }}

                    >
                      <div>
                        <strong>Set {set.set_number ?? "?"}:</strong>
                        <span style = {{ marginLeft: 12}}>
                            {set.reps !== undefined ? `${set.reps} reps` : ""}
                            {set.weight !== undefined ? ` @ ${set.weight} lb` : ""}
                            {set.time_seconds !== undefined ? ` · ${set.time_seconds}s` : ""}
                            {set.intensity ? ` · ${set.intensity}` : ""}
                        </span>
                      </div>

                      <button
                        type = "button"
                        onClick = {() => handleDeleteSet(set.id)}
                        disabled = {deletingSetById[set.id]}
                        style = {{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            background: "#fff",
                            cursor: deletingSetById[set.id] ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            }}
                        >
                        {deletingSetById[set.id] ? "Deleting..." : "Delete Set"}
                        </button>
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
