"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import SplitSelector from "@/app/components/SplitSelector";

type CreateSessionPayload = {
  date: string;
  split: string;
  notes?: string;
};

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
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Workout Session</h1>
          <p className="page-subtitle">
            Start a new workout and log the split, date, and notes.
          </p>
        </div>
      </div>

      <section
        className="section-card"
        style={{
          maxWidth: 560,
        }}
      >
        <form onSubmit={handleSubmit} className="stack-md">
          <label className="stack-sm">
            <span className="field-label">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <SplitSelector
            splitOption={splitOption}
            setSplitOption={setSplitOption}
            customSplit={customSplit}
            setCustomSplit={setCustomSplit}
          />

          <label className="stack-sm">
            <span className="field-label">Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel?"
              rows={4}
            />
          </label>

          {error && <div className="danger-text">{error}</div>}

          <div className="action-row">
            <button
              type="submit"
              disabled={loading || !finalSplit}
              className="btn btn-primary"
            >
              {loading ? "Creating..." : "Create Session"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/sessions")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}