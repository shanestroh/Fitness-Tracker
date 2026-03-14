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
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Add Exercise
        </button>
      ) : (
        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
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
                  background: "#fff",
                  color: "#111",
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
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid #111",
                  background: "#111",
                  color: "#fff",
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
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid #d0d0d0",
                  background: "#fff",
                  color: "#111",
                  cursor: "pointer",
                  fontWeight: 700,
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