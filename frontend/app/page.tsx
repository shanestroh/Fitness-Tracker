import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 24,
          color: "#111",
        }}
      >
        Personal Fitness Tracker
      </h1>

      <div style={{ display: "grid", gap: 12 }}>
        <Link href="/sessions/new" className="home-card">
          Start New Workout
        </Link>

        <Link href="/sessions" className="home-card">
          View All Workouts
        </Link>

        <Link href="/splits" className="home-card">
          Browse by Split
        </Link>
      </div>
    </main>
  );
}