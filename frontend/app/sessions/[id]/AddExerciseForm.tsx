"use client";

import { useState } from "react";

type AddExerciseFormProps = {
  exerciseName: string;
  setExerciseName: (value: string) => void;
  exerciseType: "lift" | "cardio";
  setExerciseType: (value: "lift" | "cardio") => void;
  handleAddExercise: (e: React.FormEvent) => Promise<void>;
  addingExercise: boolean;
  exerciseError: string | null;
  cardText: string;
};

export default function AddExerciseForm({
  exerciseName,
  setExerciseName,
  exerciseType,
  setExerciseType,
  handleAddExercise,
  addingExercise,
  exerciseError,
  cardText,
}: AddExerciseFormProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ marginBottom: 28 }}>
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          + Add Exercise
        </button>
      ) : (
        <section
          className="section-card"
          style={{
            color: cardText,
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 800,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              New exercise
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              Add Exercise
            </h2>
          </div>

          <form onSubmit={handleAddExercise} className="stack-md">
            <label className="stack-sm">
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                Exercise name
              </span>
              <input
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Bench Press"
                required
              />
            </label>

            <label className="stack-sm">
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                Exercise type
              </span>
              <select
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value as "lift" | "cardio")}
              >
                <option value="lift">Lift</option>
                <option value="cardio">Cardio</option>
              </select>
            </label>

            {exerciseError && (
              <div
                style={{
                  color: "var(--danger)",
                  whiteSpace: "pre-wrap",
                  fontWeight: 600,
                }}
              >
                {exerciseError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={addingExercise}
                className="btn btn-primary"
              >
                {addingExercise ? "Adding..." : "Save Exercise"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}