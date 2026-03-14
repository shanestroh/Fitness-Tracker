"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SetEntry } from "@/types/workout";
import ExerciseCard from "./ExerciseCard";
import SessionHeader from "./SessionHeader";
import AddExerciseForm from "./AddExerciseForm";
import { apiFetch } from "@/lib/apiFetch";
import type { SessionFull } from "@/types/workout";
import ConfirmModal from "@/app/components/ConfirmModal";

type SessionPageProps = {
  params: Promise<{
    id: string | number;
  }>;
};

const PRESET_SPLITS = ["Push", "Pull", "Legs", "Shoulders", "Cardio"];

function normalizeCustomSplit(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export default function SessionPage({ params }: SessionPageProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [session, setSession] = useState<SessionFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [addingExercise, setAddingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState<string | null>(null);
  const [deletingExerciseById, setDeletingExerciseById] = useState<Record<number, boolean>>({});
  const [deleteExerciseError, setDeleteExerciseError] = useState<string | null>(null);
  const [deletingSetById, setDeletingSetById] = useState<Record<number, boolean>>({});
  const [deleteSetError, setDeleteSetError] = useState<string | null>(null);
  const [deletingSession, setDeletingSession] = useState(false);
  const [deleteSessionError, setDeleteSessionError] = useState<string | null>(null);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editSplitOption, setEditSplitOption] = useState("Push");
  const [editCustomSplit, setEditCustomSplit] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [updatingSession, setUpdatingSession] = useState(false);
  const [updateSessionError, setUpdateSessionError] = useState<string | null>(null);
  const [editingSetId, setEditingSetId] = useState<number | null>(null);
  const [editSetReps, setEditSetReps] = useState("");
  const [editSetWeight, setEditSetWeight] = useState("");
  const [editSetTimeSeconds, setEditSetTimeSeconds] = useState("");
  const [editSetIntensity, setEditSetIntensity] = useState("");
  const [updatingSet, setUpdatingSet] = useState(false);
  const [updateSetError, setUpdateSetError] = useState<string | null>(null);
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);
  const [editExerciseName, setEditExerciseName] = useState("");
  const [updatingExercise, setUpdatingExercise] = useState(false);
  const [updateExerciseError, setUpdateExerciseError] = useState<string | null>(null);
  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false);
  const cardText = "#111";

  const [setFormByExercise, setSetFormByExercise] = useState<
    Record<
      number,
      {
        reps: string;
        weight: string;
        time_seconds: string;
        intensity: string;
      }
    >
  >({});

  const [setErrorByExercise, setSetErrorByExercise] = useState<Record<number, string | null>>({});
  const [addingSetByExercise, setAddingSetByExercise] = useState<Record<number, boolean>>({});

  async function loadSession(id: string) {
    setLoading(true);
    setPageError(null);

    try {
      const res = await apiFetch(`/sessions/${id}/full`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch session: ${res.status}`);
      }

      const data = await res.json();
      setSession(data);

      const loadedSplit = data.split ?? "";
      const isPresetSplit = PRESET_SPLITS.includes(loadedSplit);

      setEditSplitOption(isPresetSplit ? loadedSplit : "Other");
      setEditCustomSplit(isPresetSplit ? "" : loadedSplit);
      setEditDate(data.date ?? "");
      setEditNotes(data.notes ?? "");
    } catch (err: any) {
      setPageError(err?.message ?? "Failed to load session");
    } finally {
      setLoading(false);
    }
  }

  function updateSetForm(
    exerciseId: number,
    field: "reps" | "weight" | "time_seconds" | "intensity",
    value: string
  ) {
    setSetFormByExercise((prev) => ({
      ...prev,
      [exerciseId]: {
        reps: prev[exerciseId]?.reps ?? "",
        weight: prev[exerciseId]?.weight ?? "",
        time_seconds: prev[exerciseId]?.time_seconds ?? "",
        intensity: prev[exerciseId]?.intensity ?? "",
        [field]: value,
      },
    }));
  }

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setSessionId(resolvedParams.id);
      await loadSession(resolvedParams.id);
    }

    unwrapParams();
  }, [params]);

  async function handleAddExercise(e: React.FormEvent) {
    e.preventDefault();

    if (!sessionId) return;

    setExerciseError(null);
    setAddingExercise(true);

    const payload = {
      exercise: exerciseName,
    };

    try {
      const res = await apiFetch(`/sessions/${sessionId}/exercises`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to add exercise: ${res.status}`);
      }

      setExerciseName("");
      await loadSession(sessionId);
    } catch (err: any) {
      setExerciseError(err?.message ?? "Failed to add exercise");
    } finally {
      setAddingExercise(false);
    }
  }

  async function handleAddSet(e: React.FormEvent, exerciseId: number) {
    e.preventDefault();

    setSetErrorByExercise((prev) => ({
      ...prev,
      [exerciseId]: null,
    }));

    setAddingSetByExercise((prev) => ({
      ...prev,
      [exerciseId]: true,
    }));

    const form = setFormByExercise[exerciseId] ?? {
      reps: "",
      weight: "",
      time_seconds: "",
      intensity: "",
    };

    const payload: {
      reps?: number;
      weight?: number;
      time_seconds?: number;
      intensity?: string;
    } = {};

    if (form.reps.trim()) payload.reps = Number(form.reps);
    if (form.weight.trim()) payload.weight = Number(form.weight);
    if (form.time_seconds.trim()) payload.time_seconds = Number(form.time_seconds);
    if (form.intensity.trim()) payload.intensity = form.intensity.trim();

    const previousSession = session;

    const targetExercise = session?.exercises.find((ex) => ex.id === exerciseId);
    const nextSetNumber = (targetExercise?.sets?.length ?? 0) + 1;

    const optimisticSet = {
        id: `temp-${Date.now()}`,
        set_number: nextSetNumber,
        reps: payload.reps,
        weight: payload.weight,
        time_seconds: payload.time_seconds,
        intensity: payload.intensity,
    };

    setSession((prev) => {
        if (!prev) return prev;

        return {
            ...prev,
            exercises: prev.exercises.map((exercise) =>
                exercise.id === exerciseId
                    ? {
                        ...exercise,
                        sets: [...exercise.sets, optimisticSet],
                    }
                : exercise
            ),
        };
    });

    setSetFormByExercise((prev) => ({
        ...prev,
        [exerciseId]: {
        reps: "",
        weight: "",
        time_seconds: "",
        intensity: "",
        },
    }));

    try {
        const res = await apiFetch(`/exercises/${exerciseId}/sets`, {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Failed to add set: ${res.status}`);
        }

        await loadSession(sessionId);
      } catch (err: any) {
        setSession(previousSession);

        setSetErrorByExercise((prev) => ({
            ...prev,
            [exerciseId]: err?.message ?? "Failed to add set",
        }));
    } finally {
        setAddingSetByExercise((prev) => ({
            ...prev,
            [exerciseId]: false,
        }));
    }
  }

  async function handleDeleteExercise(exerciseId: number) {
    if (!sessionId) return;

    setDeleteExerciseError(null);

    setDeletingExerciseById((prev) => ({
      ...prev,
      [exerciseId]: true,
    }));

    try {
      const res = await apiFetch(`/exercises/${exerciseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete exercise: ${res.status}`);
      }

      await loadSession(sessionId);
    } catch (err: any) {
      setDeleteExerciseError(err?.message ?? "Failed to delete exercise");
    } finally {
      setDeletingExerciseById((prev) => ({
        ...prev,
        [exerciseId]: false,
      }));
    }
  }

  async function handleDeleteSet(setId: number) {
    if (!sessionId) return;

    setDeleteSetError(null);

    setDeletingSetById((prev) => ({
      ...prev,
      [setId]: true,
    }));

    try {
      const res = await apiFetch(`/sets/${setId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete set: ${res.status}`);
      }

      await loadSession(sessionId);
    } catch (err: any) {
      setDeleteSetError(err?.message ?? "Failed to delete set");
    } finally {
      setDeletingSetById((prev) => ({
        ...prev,
        [setId]: false,
      }));
    }
  }

  function startEditingSet(set: SetEntry) {
    setEditingSetId(set.id);
    setEditSetReps(set.reps !== undefined ? String(set.reps) : "");
    setEditSetWeight(set.weight !== undefined ? String(set.weight) : "");
    setEditSetTimeSeconds(set.time_seconds !== undefined ? String(set.time_seconds) : "");
    setEditSetIntensity(set.intensity ?? "");
    setUpdateSetError(null);
  }

  async function handleUpdateSet(e: React.FormEvent) {
    e.preventDefault();

    if (editingSetId === null) return;

    setUpdateSetError(null);
    setUpdatingSet(true);

    const payload: {
      reps?: number;
      weight?: number;
      time_seconds?: number | null;
      intensity?: string | null;
    } = {};

    if (editSetReps.trim()) payload.reps = Number(editSetReps);
    if (editSetWeight.trim()) payload.weight = Number(editSetWeight);

    if (editSetTimeSeconds.trim() === "" || Number(editSetTimeSeconds) === 0) {
      payload.time_seconds = null;
    } else {
      payload.time_seconds = Number(editSetTimeSeconds);
    }

    if (editSetIntensity.trim() === "") {
      payload.intensity = null;
    } else {
      payload.intensity = editSetIntensity.trim();
    }

    try {
      const res = await apiFetch(`/sets/${editingSetId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to update set: ${res.status}`);
      }

      await loadSession(sessionId);
      setEditingSetId(null);
    } catch (err: any) {
      setUpdateSetError(err?.message ?? "Failed to update set");
    } finally {
      setUpdatingSet(false);
    }
  }

  async function handleDeleteSession() {
    if (!sessionId) return;

    setDeleteSessionError(null);
    setDeletingSession(true);

    try {
        const res = await apiFetch(`/sessions/${sessionId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Failed to delete session: ${res.status}`);
        }

        router.push("/sessions");
      } catch (err: any) {
        setDeleteSessionError(err?.message ?? "Failed to delete session");
      } finally {
        setDeletingSession(false);
        setShowDeleteSessionModal(false);
      }
    }

  async function handleUpdateSession(e: React.FormEvent) {
    e.preventDefault();

    if (!sessionId) return;

    const finalEditSplit =
      editSplitOption === "Other"
        ? normalizeCustomSplit(editCustomSplit)
        : editSplitOption;

    if (!finalEditSplit) {
      setUpdateSessionError("Please enter a custom split name.");
      return;
    }

    setUpdateSessionError(null);
    setUpdatingSession(true);

    const payload: {
      split?: string;
      date?: string;
      notes?: string;
    } = {
      split: finalEditSplit,
      date: editDate,
      notes: editNotes.trim(),
    };

    try {
      const res = await apiFetch(`/sessions/${sessionId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to update session: ${res.status}`);
      }

      await loadSession(sessionId);
      setIsEditingSession(false);
    } catch (err: any) {
      setUpdateSessionError(err?.message ?? "Failed to update session");
    } finally {
      setUpdatingSession(false);
    }
  }

  function startEditingExercise(exercise: { id: number; exercise: string }) {
    setEditingExerciseId(exercise.id);
    setEditExerciseName(exercise.exercise);
    setUpdateExerciseError(null);
  }

  async function handleUpdateExercise(exerciseId: number) {
    if (!sessionId) return;

    setUpdateExerciseError(null);
    setUpdatingExercise(true);

    const payload = {
      exercise: editExerciseName,
    };

    try {
      const res = await apiFetch(`/exercises/${exerciseId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to update exercise: ${res.status}`);
      }

      await loadSession(sessionId);
      setEditingExerciseId(null);
    } catch (err: any) {
      setUpdateExerciseError(err?.message ?? "Failed to update exercise");
    } finally {
      setUpdatingExercise(false);
    }
  }

  async function handleMoveExercise(exerciseId: number, direction: "up" | "down") {
    if (!sessionId || !session) return;

    const sortedExercises = [...session.exercises].sort((a, b) => {
      const aIndex = a.order_index ?? 0;
      const bIndex = b.order_index ?? 0;
      return aIndex - bIndex;
    });

    const currentIndex = sortedExercises.findIndex((e) => e.id === exerciseId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sortedExercises.length) return;

    const currentExercise = sortedExercises[currentIndex];
    const targetExercise = sortedExercises[targetIndex];

    const currentOrder = currentExercise.order_index ?? currentIndex + 1;
    const targetOrder = targetExercise.order_index ?? targetIndex + 1;

    const tempOrder = 9999999;

    try {
      let res = await apiFetch(`/exercises/${currentExercise.id}`, {
        method: "PATCH",
        body: JSON.stringify({ order_index: tempOrder }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to move exercise: ${res.status}`);
      }

      res = await apiFetch(`/exercises/${targetExercise.id}`, {
        method: "PATCH",
        body: JSON.stringify({ order_index: currentOrder }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to move exercise: ${res.status}`);
      }

      res = await apiFetch(`/exercises/${currentExercise.id}`, {
        method: "PATCH",
        body: JSON.stringify({ order_index: targetOrder }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to move exercise: ${res.status}`);
      }

      await loadSession(sessionId);
    } catch (err: any) {
      setDeleteExerciseError(err?.message ?? "Failed to reorder exercise");
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 700, margin: "16px auto", padding: 16 }}>
        <p>Loading session...</p>
      </main>
    );
  }

  if (pageError || !session) {
    return (
      <main style={{ maxWidth: 700, margin: "16px auto", padding: 16 }}>
        <h1>Session Detail</h1>
        <p style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
          {pageError ?? "Session not found"}
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 700, margin: "16px auto", padding: 16 }}>
      <a
        href="/sessions"
        style={{
          display: "inline-block",
          marginBottom: 16,
          textDecoration: "none",
        }}
      >
        ← Back to Sessions
      </a>

      <SessionHeader
        split={session.split}
        date={session.date}
        notes={session.notes}
        cardText={cardText}
        isEditingSession={isEditingSession}
        setIsEditingSession={setIsEditingSession}
        editSplitOption={editSplitOption}
        setEditSplitOption={setEditSplitOption}
        editCustomSplit={editCustomSplit}
        setEditCustomSplit={setEditCustomSplit}
        editDate={editDate}
        setEditDate={setEditDate}
        editNotes={editNotes}
        setEditNotes={setEditNotes}
        updatingSession={updatingSession}
        updateSessionError={updateSessionError}
        handleUpdateSession={handleUpdateSession}
        setUpdateSessionError={setUpdateSessionError}
        deletingSession={deletingSession}
        deleteSessionError={deleteSessionError}
        handleDeleteSession={handleDeleteSession}
        setShowDeleteSessionModal={setShowDeleteSessionModal}
      />

      <AddExerciseForm
        exerciseName={exerciseName}
        setExerciseName={setExerciseName}
        handleAddExercise={handleAddExercise}
        addingExercise={addingExercise}
        exerciseError={exerciseError}
        cardText={cardText}
      />

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Exercises
      </h2>

      {deleteExerciseError && (
        <div style={{ color: "crimson", whiteSpace: "pre-wrap", marginBottom: 12 }}>
          {deleteExerciseError}
        </div>
      )}

      {deleteSetError && (
        <div style={{ color: "crimson", whiteSpace: "pre-wrap", marginBottom: 12 }}>
          {deleteSetError}
        </div>
      )}

      {session.exercises.length === 0 ? (
        <p>No exercises yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {session.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              cardText={cardText}
              isFirst={index === 0}
              isLast={index === session.exercises.length - 1}
              handleDeleteExercise={handleDeleteExercise}
              deletingExerciseById={deletingExerciseById}
              setFormByExercise={setFormByExercise}
              updateSetForm={updateSetForm}
              handleAddSet={handleAddSet}
              addingSetByExercise={addingSetByExercise}
              setErrorByExercise={setErrorByExercise}
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
              editingExerciseId={editingExerciseId}
              editExerciseName={editExerciseName}
              setEditExerciseName={setEditExerciseName}
              updatingExercise={updatingExercise}
              updateExerciseError={updateExerciseError}
              setUpdateExerciseError={setUpdateExerciseError}
              setEditingExerciseId={setEditingExerciseId}
              startEditingExercise={startEditingExercise}
              handleUpdateExercise={handleUpdateExercise}
              handleMoveExercise={handleMoveExercise}
            />
          ))}
        </div>
      )}
      <ConfirmModal
        open={showDeleteSessionModal}
        title="Delete Session?"
        message="This will permanently delete the session and all exercises and sets."
        confirmText="Delete Session"
        confirmLoading={deletingSession}
        onConfirm={handleDeleteSession}
        onCancel={() => {
            if (!deletingSession) {
                setShowDeleteSessionModal(false);
            }
        }}
        />
    </main>
  );
}