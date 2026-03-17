import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("app_auth");

  if (!authCookie) {
    redirect("/login");
  }

  return (
    <main style={{ maxWidth: 720, margin: "32px auto", padding: "0 16px" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 24,
          color: "#111",
        }}
      >
        Personal Fitness Tracker
      </h1>

      <p style={{ color: "#555", marginBottom: 28 }}>
        Track workouts, log exercises, and review your training history.
      </p>

      <div style={{ display: "grid", gap: 14 }}>
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