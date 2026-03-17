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
            <div className="eyebrow">New exercise</div>

            <h2 className="section-heading section-heading-lg">
              Add Exercise
            </h2>
          </div>

          <form onSubmit={handleAddExercise} className="stack-md">
            <label className="stack-sm">
              <span className="field-label">Exercise name</span>
              <input
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Bench Press"
                required
              />
            </label>

            <label className="stack-sm">
              <span className="field-label">Exercise type</span>
              <select
                value={exerciseType}
                onChange={(e) =>
                  setExerciseType(e.target.value as "lift" | "cardio")
                }
              >
                <option value="lift">Lift</option>
                <option value="cardio">Cardio</option>
              </select>
            </label>

            {exerciseError && (
              <div className="danger-text">{exerciseError}</div>
            )}

            <div className="action-row">
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