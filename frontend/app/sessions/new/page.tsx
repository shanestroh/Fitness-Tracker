"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";

type CreateSessionPayload = {
  date: string;
  split: string;
  notes?: string;
};

const PRESET_SPLITS = [
  "Push",
  "Pull",
  "Legs",
  "Shoulders",
  "Cardio",
  "Other",
];

function normalizeCustomSplit(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export default function NewSessionPage() {
  const router = useRouter();

  const [date, setDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [splitOption, setSplitOption] = useState("Push");
  const [customSplit, setCustomSplit] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalSplit =
    splitOption === "Other"
      ? normalizeCustomSplit(customSplit)
      : splitOption;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!finalSplit) {
      setError("Please enter a custom split name.");
      return;
    }

    setLoading(true);

    const payload: CreateSessionPayload = {
      date,
      split: finalSplit,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    try {
      const res = await apiFetch("/sessions", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      const sessionId = data?.id;

      if (sessionId) {
        router.push(`/sessions/${sessionId}`);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Create Workout Session
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
              background: "#fff",
              color: "#111",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Split</span>
          <select
            value={splitOption}
            onChange={(e) => setSplitOption(e.target.value)}
            style={{
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
              background: "#fff",
              color: "#111",
            }}
          >
            {PRESET_SPLITS.map((split) => (
              <option key={split} value={split}>
                {split}
              </option>
            ))}
          </select>
        </label>

        {splitOption === "Other" && (
          <label style={{ display: "grid", gap: 6 }}>
            <span>Custom Split Name</span>
            <input
              value={customSplit}
              onChange={(e) => setCustomSplit(e.target.value)}
              placeholder="Enter custom split"
              required
              style={{
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 8,
                background: "#fff",
                color: "#111",
              }}
            />
          </label>
        )}

        <label style={{ display: "grid", gap: 6 }}>
          <span>Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel?"
            rows={4}
            style={{
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
              background: "#fff",
              color: "#111",
            }}
          />
        </label>

        {error && (
          <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={loading || !finalSplit}
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid #d0d0d0",
              background: "#fff",
              cursor: loading || !finalSplit ? "not-allowed" : "pointer",
              fontWeight: 700,
              color: "#111",
            }}
          >
            {loading ? "Creating..." : "Create Session"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/sessions")}
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid #d0d0d0",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              color: "#444",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}