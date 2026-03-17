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
  pendingExerciseEditsById: Record<number, boolean>;

  setFormByExercise: Record<
    number,
    {
      reps: string;
      weight: string;
      time_seconds: string;
      time_minutes: string;
      intensity: string;
    }
  >;
  updateSetForm: (
    exerciseId: number,
    field: "reps" | "weight" | "time_minutes" | "time_seconds" | "intensity",
    value: string
  ) => void;
  handleAddSet: (e: React.FormEvent, exerciseId: number) => Promise<void>;
  addingSetByExercise: Record<number, boolean>;
  setErrorByExercise: Record<number, string | null>;

  editingSetId: number | string | null;
  editSetReps: string;
  setEditSetReps: (value: string) => void;
  editSetWeight: string;
  setEditSetWeight: (value: string) => void;
  editSetTimeSeconds: string;
  setEditSetTimeSeconds: (value: string) => void;
  editSetTimeMinutes: string;
  setEditSetTimeMinutes: (value: string) => void;
  editSetIntensity: string;
  setEditSetIntensity: (value: string) => void;
  updateSetError: string | null;
  updatingSet: boolean;
  handleUpdateSet: (e: React.FormEvent) => Promise<void>;
  startEditingSet: (set: SetEntry, exerciseType: "lift" | "cardio") => void;
  handleDeleteSet: (setId: number | string) => Promise<void>;
  deletingSetById: Record<string, boolean>;
  pendingSetEditsById: Record<string, boolean>;
  setEditingSetId: (id: number | string | null) => void;
  setUpdateSetError: (value: string | null) => void;

  editingExerciseId: number | null;
  editExerciseName: string;
  setEditExerciseName: (value: string) => void;
  editExerciseType: "lift" | "cardio";
  setEditExerciseType: (value: "lift" | "cardio") => void;
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
  editSetTimeMinutes,
  setEditSetTimeMinutes,
  editSetIntensity,
  setEditSetIntensity,
  updateSetError,
  updatingSet,
  handleUpdateSet,
  startEditingSet,
  handleDeleteSet,
  deletingSetById,
  pendingSetEditsById,
  setEditingSetId,
  setUpdateSetError,
  editingExerciseId,
  editExerciseName,
  setEditExerciseName,
  editExerciseType,
  setEditExerciseType,
  updatingExercise,
  updateExerciseError,
  setUpdateExerciseError,
  setEditingExerciseId,
  startEditingExercise,
  handleUpdateExercise,
  handleMoveExercise,
  pendingExerciseEditsById,
}: ExerciseCardProps) {
  const [showAddSetForm, setShowAddSetForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);


  return (
    <section
      className="section-card"
      style={{
        color: cardText,
        padding: 20,
      }}
    >
      {editingExerciseId === exercise.id ? (
        <div className="stack-md">
          <div>
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
              Edit exercise
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              Update exercise details
            </h3>
          </div>

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
              value={editExerciseName}
              onChange={(e) => setEditExerciseName(e.target.value)}
              placeholder="Exercise name"
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
              value={editExerciseType}
              onChange={(e) =>
                setEditExerciseType(e.target.value as "lift" | "cardio")
              }
            >
              <option value="lift">Lift</option>
              <option value="cardio">Cardio</option>
            </select>
          </label>

          {updateExerciseError && (
            <div
              style={{
                color: "var(--danger)",
                whiteSpace: "pre-wrap",
                fontWeight: 600,
              }}
            >
              {updateExerciseError}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => handleUpdateExercise(exercise.id)}
              disabled={updatingExercise}
              className="btn btn-primary"
            >
              {updatingExercise ? "Saving..." : "Save Exercise"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingExerciseId(null);
                setUpdateExerciseError(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: isExpanded ? 16 : 0,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsExpanded((prev) => {
                  const next = !prev;
                  if (!next) {
                    setShowAddSetForm(false);
                    setEditingSetId(null);
                    setUpdateSetError(null);
                  }
                  return next;
                });
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                textAlign: "left",
                color: "inherit",
                flex: "1 1 260px",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1.15,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                  }}
                >
                  {exercise.order_index !== undefined
                    ? `${exercise.order_index}. ${exercise.exercise}`
                    : exercise.exercise}
                </h3>

                <span className="badge badge-neutral">
                  {exercise.exercise_type === "lift" ? "Lift" : "Cardio"}
                </span>

                {pendingExerciseEditsById[exercise.id] && (
                  <span className="badge badge-warning">Pending sync</span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--primary)",
                    fontWeight: 700,
                  }}
                >
                  {isExpanded ? "Hide details ▲" : "Show details ▼"}
                </span>
              </div>
            </button>

            <div
              style={{
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
                  className="btn btn-secondary"
                  style={{ minWidth: 44, paddingInline: 12 }}
                  aria-label="Move exercise up"
                  title="Move up"
                >
                  ↑
                </button>
              )}

              {!isLast && (
                <button
                  type="button"
                  onClick={() => handleMoveExercise(exercise.id, "down")}
                  className="btn btn-secondary"
                  style={{ minWidth: 44, paddingInline: 12 }}
                  aria-label="Move exercise down"
                  title="Move down"
                >
                  ↓
                </button>
              )}

              <button
                type="button"
                onClick={() => startEditingExercise(exercise)}
                className="btn btn-secondary"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDeleteExercise(exercise.id)}
                disabled={deletingExerciseById[exercise.id]}
                className="btn btn-danger"
              >
                {deletingExerciseById[exercise.id] ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {isExpanded && (
            <>
              {exercise.sets.length === 0 ? (
                <section
                  style={{
                    border: "1px dashed var(--border-strong)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface-alt)",
                    padding: 16,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "var(--text-muted)",
                      fontSize: 15,
                    }}
                  >
                    No sets yet.
                  </p>
                </section>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
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
                      editSetTimeMinutes={editSetTimeMinutes}
                      setEditSetTimeMinutes={setEditSetTimeMinutes}
                      editSetIntensity={editSetIntensity}
                      setEditSetIntensity={setEditSetIntensity}
                      updateSetError={updateSetError}
                      updatingSet={updatingSet}
                      handleUpdateSet={handleUpdateSet}
                      startEditingSet={(set) => {
                        setShowAddSetForm(false);
                        startEditingSet(set, exercise.exercise_type);
                      }}
                      handleDeleteSet={handleDeleteSet}
                      deletingSetById={deletingSetById}
                      pendingSetEditsById={pendingSetEditsById}
                      setEditingSetId={setEditingSetId}
                      setUpdateSetError={setUpdateSetError}
                      exerciseType={exercise.exercise_type}
                    />
                  ))}
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                {!showAddSetForm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSetId(null);
                      setUpdateSetError(null);

                      if (exercise.exercise_type === "lift") {
                        updateSetForm(exercise.id, "time_seconds", "");
                        updateSetForm(exercise.id, "intensity", "");
                      } else {
                        updateSetForm(exercise.id, "reps", "");
                        updateSetForm(exercise.id, "weight", "");
                      }

                      setShowAddSetForm(true);
                    }}
                    className="btn btn-primary"
                  >
                    + Add Set
                  </button>
                ) : (
                  <section
                    style={{
                      marginTop: 4,
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-alt)",
                      padding: 16,
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
                        New set
                      </div>

                      <h4
                        style={{
                          margin: 0,
                          fontSize: 18,
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          color: "var(--text)",
                        }}
                      >
                        Add Set
                      </h4>
                    </div>

                    <form
                      onSubmit={(e) => handleAddSet(e, exercise.id)}
                      className="stack-md"
                    >
                      {exercise.exercise_type === "lift" ? (
                        <>
                          <label className="stack-sm">
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--text)",
                              }}
                            >
                              Reps
                            </span>
                            <input
                              type="number"
                              value={setFormByExercise[exercise.id]?.reps ?? ""}
                              onChange={(e) =>
                                updateSetForm(exercise.id, "reps", e.target.value)
                              }
                              placeholder="10"
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
                              Weight
                            </span>
                            <input
                              type="number"
                              value={setFormByExercise[exercise.id]?.weight ?? ""}
                              onChange={(e) =>
                                updateSetForm(exercise.id, "weight", e.target.value)
                              }
                              placeholder="135"
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <div className="stack-sm">
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--text)",
                              }}
                            >
                              Time
                            </span>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 10,
                              }}
                            >
                              <label className="stack-sm">
                                <span
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  Minutes
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  value={setFormByExercise[exercise.id]?.time_minutes ?? ""}
                                  onChange={(e) =>
                                    updateSetForm(
                                      exercise.id,
                                      "time_minutes",
                                      e.target.value
                                    )
                                  }
                                  placeholder="5"
                                />
                              </label>

                              <label className="stack-sm">
                                <span
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  Seconds
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  max="59"
                                  value={setFormByExercise[exercise.id]?.time_seconds ?? ""}
                                  onChange={(e) =>
                                    updateSetForm(
                                      exercise.id,
                                      "time_seconds",
                                      e.target.value
                                    )
                                  }
                                  placeholder="30"
                                />
                              </label>
                            </div>
                          </div>

                          <label className="stack-sm">
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--text)",
                              }}
                            >
                              Intensity
                            </span>
                            <input
                              type="text"
                              value={setFormByExercise[exercise.id]?.intensity ?? ""}
                              onChange={(e) =>
                                updateSetForm(exercise.id, "intensity", e.target.value)
                              }
                              placeholder="Moderate"
                            />
                          </label>
                        </>
                      )}

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                          type="submit"
                          disabled={addingSetByExercise[exercise.id]}
                          className="btn btn-primary"
                        >
                          {addingSetByExercise[exercise.id]
                            ? "Adding..."
                            : "Save Set"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowAddSetForm(false)}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>

                    {setErrorByExercise[exercise.id] && (
                      <div
                        style={{
                          marginTop: 10,
                          color: "var(--danger)",
                          whiteSpace: "pre-wrap",
                          fontWeight: 600,
                        }}
                      >
                        {setErrorByExercise[exercise.id]}
                      </div>
                    )}
                  </section>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}