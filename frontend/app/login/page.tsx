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
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        className="surface-card"
        style={{
          width: "100%",
          maxWidth: 460,
          padding: 28,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(20px, 5vw, 26px)",
            fontWeight: 800,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          Skrunch&apos;s Fitness Tracker
        </h1>

        <p
          style={{
            margin: "0 0 20px",
            fontSize: 15,
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          Enter your password to continue
        </p>

        <form onSubmit={handleSubmit} className="stack-md">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />

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
      </div>
    </main>
  );
}