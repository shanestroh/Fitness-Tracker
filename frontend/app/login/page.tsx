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

      router.push("/sessions");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Personal Fitness Tracker
      </h1>

      <p style={{ marginTop: 0, marginBottom: 16, color: "#555" }}>
        Enter password to continue
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            padding: 12,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        />

        {error && (
          <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #d0d0d0",
            background: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700,
            color: "#444",
          }}
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </main>
  );
}