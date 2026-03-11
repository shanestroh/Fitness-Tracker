"use client";

import { useState } from "react";
import { ExerciseEntry, SetEntry } from "@/types/workout";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  exercise: ExerciseEntry;
  cardText: string;

  isFirst: boolean;
  isLast: boolean;

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
  handleMoveExercise: (exerciseId: number, direction: "up" | "down") => Promise<void>;

};

export default function ExerciseCard({
  exercise,
  cardText,
  isFirst,
  isLast,
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
  handleMoveExercise,
}: ExerciseCardProps) {
    const [showAddSetForm, setShowAddSetForm] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

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

    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
      alignItems: "flex-start",
      marginBottom: 10,
      gap: 12,
      flexWrap:"wrap"
    }}
  >

  <button
    type="button"
    onClick={() => {
        setIsExpanded((prev) => {
            const next = !prev;
            if (!next) setShowAddSetForm(false);
            return next;
        });
    }}
    style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        font: "inherit",
        color: "inherit",
        textAlign: "left",
        flex: "1 1 220px",
        minWidth: 0,
    }}
    >
    <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
        {exercise.order_index !== undefined ? `${exercise.order_index}. ` : ""}
        {exercise.exercise} {isExpanded ? "▼" : "▶"}
    </h3>
  </button>

    <div style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: "flex-end",
        }}
    >
    {!isFirst && (
      <button
        type="button"
        onClick={() => handleMoveExercise(exercise.id, "up")}
        style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #d0d0d0",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            }}
        >
        ↑
        </button>
        )}
    {!isLast && (
      <button
        type="button"
        onClick={() => handleMoveExercise(exercise.id, "down")}
        style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #d0d0d0",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
        }}
    >
        ↓
        </button>
    )}
      <button
        type="button"
        onClick={() => startEditingExercise(exercise)}
        style={{
          padding: "10px 14px",
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
          padding: "10px 14px",
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

{isExpanded && (
  <>
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
                  style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
                />
              </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Weight</span>
            <input
              type="number"
              value={setFormByExercise[exercise.id]?.weight ?? ""}
              onChange={(e) => updateSetForm(exercise.id, "weight", e.target.value)}
              placeholder="135"
              style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Time (seconds)</span>
            <input
                type="number"
                value={setFormByExercise[exercise.id]?.time_seconds ?? ""}
                onChange={(e) =>
                    updateSetForm(exercise.id, "time_seconds", e.target.value)
                }
                placeholder="Cardio only"
                style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Intensity</span>
            <input
                type="text"
                value={setFormByExercise[exercise.id]?.intensity ?? ""}
                onChange={(e) =>
                    updateSetForm(exercise.id, "intensity", e.target.value)
                }
                placeholder="Cardio only"
                style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
            />
          </label>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
    </>
    )}
    </section>
  );
}