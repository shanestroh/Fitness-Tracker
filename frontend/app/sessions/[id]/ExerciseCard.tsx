"use client";

import { useState } from "react";
import { ExerciseEntry, SetEntry } from "@/types/workout";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  exercise: ExerciseEntry;
  cardText: string;

  handleDeleteExercise: (exerciseId: number) => Promise<void>;
  deletingExerciseById: Record<number, boolean>;

  setFormByExercise: Record<
    number,
    {
      reps: string;
      weight: string;
      time_seconds: string;
      intensity: string;
    }
  >;
  updateSetForm: (
    exerciseId: number,
    field: "reps" | "weight" | "time_seconds" | "intensity",
    value: string
  ) => void;
  handleAddSet: (e: React.FormEvent, exerciseId: number) => Promise<void>;
  addingSetByExercise: Record<number, boolean>;
  setErrorByExercise: Record<number, string | null>;

  editingSetId: number | null;
  editSetReps: string;
  setEditSetReps: (value: string) => void;
  editSetWeight: string;
  setEditSetWeight: (value: string) => void;
  editSetTimeSeconds: string;
  setEditSetTimeSeconds: (value: string) => void;
  editSetIntensity: string;
  setEditSetIntensity: (value: string) => void;
  updateSetError: string | null;
  updatingSet: boolean;
  handleUpdateSet: (e: React.FormEvent) => Promise<void>;
  startEditingSet: (set: SetEntry) => void;
  handleDeleteSet: (setId: number) => Promise<void>;
  deletingSetById: Record<number, boolean>;
  setEditingSetId: (id: number | null) => void;
  setUpdateSetError: (value: string | null) => void;
  editingExerciseId: number | null;
  editExerciseName: string;
  setEditExerciseName: (value: string) => void;
  updatingExercise: boolean;
  updateExerciseError: string | null;
  setUpdateExerciseError: (value: string | null) => void;
  setEditingExerciseId: (id: number | null) => void;
  startEditingExercise: (exercise: ExerciseEntry) => void;
  handleUpdateExercise: (exerciseId: number) => Promise<void>;

};

export default function ExerciseCard({
  exercise,
  cardText,
  handleDeleteExercise,
  deletingExerciseById,
  setFormByExercise,
  updateSetForm,
  handleAddSet,
  addingSetByExercise,
  setErrorByExercise,
  editingSetId,
  editSetReps,
  setEditSetReps,
  editSetWeight,
  setEditSetWeight,
  editSetTimeSeconds,
  setEditSetTimeSeconds,
  editSetIntensity,
  setEditSetIntensity,
  updateSetError,
  updatingSet,
  handleUpdateSet,
  startEditingSet,
  handleDeleteSet,
  deletingSetById,
  setEditingSetId,
  setUpdateSetError,
  editingExerciseId,
  editExerciseName,
  setEditExerciseName,
  updatingExercise,
  updateExerciseError,
  setUpdateExerciseError,
  setEditingExerciseId,
  startEditingExercise,
  handleUpdateExercise,
}: ExerciseCardProps) {
    const [showAddSetForm, setShowAddSetForm] = useState(false);

  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 18,
        background: "#fff",
        color: cardText,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
{editingExerciseId === exercise.id ? (
  <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
    <label style={{ display: "grid", gap: 6 }}>
      <span>Exercise name</span>
      <input
        value={editExerciseName}
        onChange={(e) => setEditExerciseName(e.target.value)}
        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
      />
    </label>

    {updateExerciseError && (
      <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
        {updateExerciseError}
      </div>
    )}

    <div style={{ display: "flex", gap: 10 }}>
      <button
        type="button"
        onClick={() => handleUpdateExercise(exercise.id)}
        disabled={updatingExercise}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #d0d0d0",
          background: "#fff",
          cursor: updatingExercise ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {updatingExercise ? "Saving..." : "Save"}
      </button>

      <button
        type="button"
        onClick={() => {
          setEditingExerciseId(null);
          setUpdateExerciseError(null);
        }}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #d0d0d0",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Cancel
      </button>
    </div>
  </div>
) : (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      gap: 12,
    }}
  >
    <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            {exercise.order_index !== undefined ? `${exercise.order_index}. ` : ""}
            {exercise.exercise}
          </h3>

    <div style={{ display: "flex", gap: 8 }}>
      <button
        type="button"
        onClick={() => startEditingExercise(exercise)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #d0d0d0",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Edit Exercise
      </button>

      <button
        type="button"
        onClick={() => handleDeleteExercise(exercise.id)}
        disabled={deletingExerciseById[exercise.id]}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #d0d0d0",
          background: "#fff",
          cursor: deletingExerciseById[exercise.id] ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {deletingExerciseById[exercise.id] ? "Deleting..." : "Delete Exercise"}
      </button>
    </div>
  </div>
)}
{exercise.sets.length === 0 ? (
        <p style={{ color: "#666", marginTop: 8 }}>No sets yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {exercise.sets.map((set) => (
            <SetRow
              key={set.id}
              set={set}
              cardText={cardText}
              editingSetId={editingSetId}
              editSetReps={editSetReps}
              setEditSetReps={setEditSetReps}
              editSetWeight={editSetWeight}
              setEditSetWeight={setEditSetWeight}
              editSetTimeSeconds={editSetTimeSeconds}
              setEditSetTimeSeconds={setEditSetTimeSeconds}
              editSetIntensity={editSetIntensity}
              setEditSetIntensity={setEditSetIntensity}
              updateSetError={updateSetError}
              updatingSet={updatingSet}
              handleUpdateSet={handleUpdateSet}
              startEditingSet={startEditingSet}
              handleDeleteSet={handleDeleteSet}
              deletingSetById={deletingSetById}
              setEditingSetId={setEditingSetId}
              setUpdateSetError={setUpdateSetError}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {!showAddSetForm ? (
          <button
            type="button"
            onClick={() => setShowAddSetForm(true)}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #d0d0d0",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Add Set
          </button>
        ) : (
      <section
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 14,
          marginBottom: 16,
          background: "#fcfcfc",
          color: cardText,
        }}
      >
        <h4 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px 0" }}>
          Add Set
        </h4>

        <form
              onSubmit={(e) => handleAddSet(e, exercise.id)}
              style={{ display: "grid", gap: 10 }}
            >
              <label style={{ display: "grid", gap: 4 }}>
                <span>Reps</span>
                <input
                  type="number"
                  value={setFormByExercise[exercise.id]?.reps ?? ""}
                  onChange={(e) => updateSetForm(exercise.id, "reps", e.target.value)}
                  placeholder="10"
                  style={{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
                />
              </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Weight</span>
            <input
              type="number"
              value={setFormByExercise[exercise.id]?.weight ?? ""}
              onChange={(e) => updateSetForm(exercise.id, "weight", e.target.value)}
              placeholder="135"
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  disabled={addingSetByExercise[exercise.id]}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    border: "none",
                    cursor: addingSetByExercise[exercise.id] ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {addingSetByExercise[exercise.id] ? "Adding..." : "Save Set"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddSetForm(false)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #d0d0d0",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>

            {setErrorByExercise[exercise.id] && (
              <div style={{ color: "crimson", whiteSpace: "pre-wrap", marginTop: 10 }}>
                {setErrorByExercise[exercise.id]}
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}