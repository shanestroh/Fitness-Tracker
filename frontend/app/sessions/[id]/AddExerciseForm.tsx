"use client";

import {useState } from "react";

type AddExerciseFormProps = {
  exerciseName: string;
  setExerciseName: (value: string) => void;
  handleAddExercise: (e: React.FormEvent) => Promise<void>;
  addingExercise: boolean;
  exerciseError: string | null;
  cardText: string;
};

export default function AddExerciseForm({
  exerciseName,
  setExerciseName,
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
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #d0d0d0",
            background: "#fff",
            color: cardText,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add Exercise
        </button>
      ) : (
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: 16,
            padding: 18,
            background: "#fff",
            color: cardText,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Add Exercise
          </h2>

          <form
            onSubmit={handleAddExercise}
            style={{ display: "grid", gap: 12 }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              <span>Exercise name</span>
              <input
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Bench Press"
                required
                style={{
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                }}
              />
            </label>

            {exerciseError && (
              <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
                {exerciseError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                disabled={addingExercise}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "none",
                  cursor: addingExercise ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {addingExercise ? "Adding..." : "Save Exercise"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #d0d0d0",
                  background: "#fff",
                  color: cardText,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
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