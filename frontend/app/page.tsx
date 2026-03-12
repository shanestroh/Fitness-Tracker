import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
        Personal Fitness Tracker
      </h1>

      <div style={{ display: "grid", gap: 12 }}>
        <Link
          href="/sessions/new"
          style={{
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 12,
            textDecoration: "none",
            display: "block",
          }}
        >
          Start New Workout
        </Link>

        <Link
          href="/sessions"
          style={{
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 12,
            textDecoration: "none",
            display: "block",
          }}
        >
          View All Workouts
        </Link>

        <Link
          href="/splits"
          style={{
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 12,
            textDecoration: "none",
            display: "block",
          }}
        >
          Browse by Split
        </Link>
      </div>
    </main>
  );
}