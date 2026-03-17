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
      <section style={{ marginBottom: 20 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 6vw, 42px)"
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            maxWidth: 700,
          }}
        >
          Ready to train?
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
                  Create a new session and log your workout.
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