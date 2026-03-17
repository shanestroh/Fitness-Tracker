"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="page-shell"
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <section
        className="section-card"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: 24,
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h1
            style={{
              fontSize: "clamp(20px, 5vw, 28px)",
              fontWeight: 800,
              marginBottom: 8,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Skrunch&apos;s Fitness Tracker
          </h1>

          <p
            className="muted-copy"
            style={{
              margin: 0,
            }}
          >
            Enter your password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="stack-md">
          <label className="stack-sm">
            <span className="field-label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
            />
          </label>

          {error && <div className="danger-text">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? "Checking..." : "Enter"}
          </button>
        </form>
      </section>
    </main>
  );
}