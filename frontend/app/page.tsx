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
    <main className="page-shell">
      {/* Hero */}
      <section style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 10px",
            borderRadius: 999,
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          Personal Fitness Tracker
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 42,
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            maxWidth: 700,
          }}
        >
          Ready to train today?
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            maxWidth: 620,
            fontSize: 17,
            lineHeight: 1.6,
            color: "var(--text-muted)",
          }}
        >
          Start a new workout, review your training history, or browse your
          sessions by split.
        </p>
      </section>

      {/* Actions */}
      <section style={{ display: "grid", gap: 16 }}>
        {/* PRIMARY CTA */}
        <Link href="/sessions/new" style={{ textDecoration: "none" }}>
          <div
            style={{
              borderRadius: 22,
              padding: "24px 22px",
              background:
                "linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)",
              color: "#fff",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                opacity: 0.9,
                marginBottom: 10,
              }}
            >
              Main action
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 30,
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    color: "#fff",
                  }}
                >
                  Start New Workout
                </h2>

                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 15,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Create a new session and begin logging your workout.
                </p>
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                }}
              >
                →
              </div>
            </div>
          </div>
        </Link>

        {/* SECONDARY ACTIONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          <Link
            href="/sessions"
            className="surface-card"
            style={{ padding: 20, textDecoration: "none" }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              View All Workouts
            </h2>

            <p
              style={{
                marginTop: 10,
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              See your full workout history.
            </p>
          </Link>

          <Link
            href="/splits"
            className="surface-card"
            style={{ padding: 20, textDecoration: "none" }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              Browse Splits
            </h2>

            <p
              style={{
                marginTop: 10,
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              Jump into Push, Pull, Legs, and more.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}