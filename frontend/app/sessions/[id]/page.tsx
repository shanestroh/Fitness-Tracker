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

async function getSession(id: string): Promise<SessionFull> {
  const res = await fetch(`http://localhost:8000/sessions/${id}/full`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch session: ${res.status}`);
  }

  return res.json();
}


export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const session = await getSession(id);

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
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
