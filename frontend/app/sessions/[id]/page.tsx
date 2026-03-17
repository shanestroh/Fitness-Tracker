"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ExerciseEntry, SetEntry, SessionFull } from "@/types/workout";
import ExerciseCard from "./ExerciseCard";
import SessionHeader from "./SessionHeader";
import AddExerciseForm from "./AddExerciseForm";
import { apiFetch } from "@/lib/apiFetch";
import ConfirmModal from "@/app/components/ConfirmModal";
import Link from "next/link";
import { useOfflineSessionSync } from "@/hooks/useOfflineSessionSync";

import {
  enqueueAddSetAction,
  enqueueAddExerciseAction,
  enqueueOrReplaceEditSetAction,
  enqueueOrReplaceDeleteSetAction,
  enqueueOrReplaceEditExerciseAction,
  enqueueOrReplaceDeleteExerciseAction,
  removeQueuedAddSetByTempId,
  removeQueuedAddSetsByExerciseId,
  removeQueuedAddExerciseByTempId,
  removeQueuedEditExerciseByExerciseId,
  updateQueuedAddSetByTempId,
} from "@/lib/offline/offlineQueue";

import { applyQueuedChangesToSession } from "@/lib/offline/sessionQueueHelpers";

import {
  addOptimisticExercise,
  removeExerciseFromSession,
  addOptimisticSet,
  removeSetFromSession,
  updateSetInSession,
  updateExerciseInSession,
} from "@/lib/session/sessionMutations";

type SessionPageProps = {
    params: Promise<{
        id: number | string;
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
  const [deletingSetById, setDeletingSetById] = useState<Record<string, boolean>>({});
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
  const [editingSetId, setEditingSetId] = useState<number | string | null>(null);
  const [editSetReps, setEditSetReps] = useState("");
  const [editSetWeight, setEditSetWeight] = useState("");
  const [editSetTimeSeconds, setEditSetTimeSeconds] = useState("");
  const [editSetIntensity, setEditSetIntensity] = useState("");
  const [updatingSet, setUpdatingSet] = useState(false);
  const [updateSetError, setUpdateSetError] = useState<string | null>(null);
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);
  const [editExerciseName, setEditExerciseName] = useState("");
  const [editExerciseType, setEditExerciseType] = useState<"lift" | "cardio">("lift");
  const [updatingExercise, setUpdatingExercise] = useState(false);
  const [updateExerciseError, setUpdateExerciseError] = useState<string | null>(null);
  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false);
  const [exerciseType, setExerciseType] = useState<"lift" | "cardio">("lift");
  const [editSetTimeMinutes, setEditSetTimeMinutes] = useState("");
  const cardText = "#111";



  const [setFormByExercise, setSetFormByExercise] = useState<
    Record<
      number,
      {
        reps: string;
        weight: string;
        time_minutes: string;
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
      const hydratedSession = applyQueuedChangesToSession(data, id);
      setSession(hydratedSession);
      refreshPendingQueueCount(id);

      const loadedSplit = hydratedSession.split ?? "";
      const isPresetSplit = PRESET_SPLITS.includes(loadedSplit);

      setEditSplitOption(isPresetSplit ? loadedSplit : "Other");
      setEditCustomSplit(isPresetSplit ? "" : loadedSplit);
      setEditDate(hydratedSession.date ?? "");
      setEditNotes(hydratedSession.notes ?? "");

    } catch (err: any) {
      setPageError(err?.message ?? "Failed to load session");
    } finally {
      setLoading(false);
    }
  }

  const {
    isOnline,
    pendingQueueCount,
    pendingSetEditsById,
    pendingExerciseEditsById,
    refreshPendingQueueCount,
    markSetPending,
    clearPendingSet,
    markExercisePending,
    clearPendingExercise,
  } = useOfflineSessionSync({
    sessionId,
    loadSession,
  });

  useEffect(() => {
    async function unwrapParams() {
        const resolvedParams = await params;
        const id = String(resolvedParams.id);

        setSessionId(id);
        await loadSession(id);
    }

    unwrapParams();
  }, [params]);

  function updateSetForm(
    exerciseId: number,
    field: "reps" | "weight" | "time_minutes" | "time_seconds" | "intensity",
    value: string
  ) {
    setSetFormByExercise((prev) => ({
      ...prev,
      [exerciseId]: {
        reps: prev[exerciseId]?.reps ?? "",
        weight: prev[exerciseId]?.weight ?? "",
        time_minutes: prev[exerciseId]?.time_minutes ?? "",
        time_seconds: prev[exerciseId]?.time_seconds ?? "",
        intensity: prev[exerciseId]?.intensity ?? "",
        [field]: value,
      },
    }));
  }

  async function handleAddExercise(e: React.FormEvent) {
    e.preventDefault();

    if (!sessionId || !session) return;

    const trimmedExerciseName = exerciseName.trim();
    if (!trimmedExerciseName) return;

    setExerciseError(null);
    setAddingExercise(true);

    const payload = {
      exercise: trimmedExerciseName,
      exercise_type: exerciseType,
    };

    const previousSession = session;

    const nextOrderIndex =
        session.exercises.length > 0
            ? Math.max(...session.exercises.map((ex) => ex.order_index ?? 0)) + 1
            : 1;

    const tempExerciseId = -Date.now();

    const optimisticExercise = {
        id: tempExerciseId,
        exercise: trimmedExerciseName,
        exercise_type: exerciseType,
        order_index: nextOrderIndex,
        sets: [],
    };

    setSession((prev) => (prev ? addOptimisticExercise(prev, optimisticExercise) : prev));

    setExerciseName("");
    setExerciseType("lift");

    try {
      const res = await apiFetch(`/sessions/${sessionId}/exercises`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setSession(previousSession)
        setExerciseError(text || `Failed to add exercise: ${res.status}`);
        return;
      }

      await loadSession(sessionId);
    } catch (err: any) {
      enqueueAddExerciseAction({
          id: `queue-${Date.now()}-exercise`,
          type: "add-exercise",
          sessionId,
          tempExerciseId,
          payload,
          createdAt: Date.now(),
      });

      refreshPendingQueueCount(sessionId);
      setExerciseError("Connection issue. Saved offline and will retry.");
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
      time_minutes: "",
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

    const minutes = form.time_minutes.trim() ? Number(form.time_minutes) : 0;
    const seconds = form.time_seconds.trim() ? Number(form.time_seconds) : 0;

    if (minutes > 0 || seconds > 0) {
        payload.time_seconds = minutes * 60 + seconds;
    }
    if (form.intensity.trim()) payload.intensity = form.intensity.trim();

    const previousSession = session;

    const targetExercise = session?.exercises.find((ex) => ex.id === exerciseId);
    const nextSetNumber = (targetExercise?.sets?.length ?? 0) + 1;

    const tempSetId = `temp-${Date.now()}`;

    const optimisticSet = {
        id: tempSetId,
        set_number: nextSetNumber,
        reps: payload.reps,
        weight: payload.weight,
        time_seconds: payload.time_seconds,
        intensity: payload.intensity,
    };

    setSession((prev) => (prev ? addOptimisticSet(prev, exerciseId, optimisticSet) : prev));

    setSetFormByExercise((prev) => ({
        ...prev,
        [exerciseId]: {
        reps: "",
        weight: "",
        time_minutes: "",
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

            //Real server rejection: rollback and show actual error
            setSession(previousSession)
            setSetErrorByExercise((prev) => ({
                ...prev,
                [exerciseId]: text || `Failed to add set: ${res.status}`,
            }));
            return;
        }

        await loadSession(sessionId);
      } catch (err: any) {
            enqueueAddSetAction({
                id: `queue-${Date.now()}-${exerciseId}`,
                type: "add-set",
                sessionId,
                exerciseId,
                tempSetId,
                payload,
                createdAt: Date.now(),
            });

            refreshPendingQueueCount(sessionId);

            setSetErrorByExercise((prev) => ({
                ...prev,
                [exerciseId]: "Connection issue. Saved offline and will retry.",
            }));
          } finally {
            setAddingSetByExercise((prev) => ({
                ...prev,
                [exerciseId]: false,
            }));
        }
    }

  async function handleDeleteExercise(exerciseId: number) {
    if (!sessionId || !session) return;

    setDeleteExerciseError(null);

    setSession((prev) => (prev ? removeExerciseFromSession(prev, exerciseId) : prev));

    // Temporary optimistic exercise: no server delete needed
    if (exerciseId < 0) {
        removeQueuedAddExerciseByTempId(exerciseId);
        removeQueuedAddSetsByExerciseId(exerciseId);
        removeQueuedEditExerciseByExerciseId(exerciseId);
        refreshPendingQueueCount(sessionId);
        clearPendingExercise(exerciseId);
        return;
        }

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

      clearPendingExercise(exerciseId);
      refreshPendingQueueCount(sessionId);

      await loadSession(sessionId);
    } catch (err: any) {
      enqueueOrReplaceDeleteExerciseAction({
          id: `queue-delete-exercise-${sessionId}-${exerciseId}`,
           type: "delete-exercise",
           sessionId,
           exerciseId,
           createdAt: Date.now(),
      });

      refreshPendingQueueCount(sessionId);
      clearPendingExercise(exerciseId);

      setDeleteExerciseError("Connection issue. Delete saved offline and will retry.");
    } finally {
      setDeletingExerciseById((prev) => ({
        ...prev,
        [exerciseId]: false,
      }));
    }
  }

  async function handleDeleteSet(setId: number | string) {
    if (!sessionId || !session) return;

    setDeleteSetError(null);

    const setKey = String(setId);

    setSession((prev) => (prev ? removeSetFromSession(prev, setId) : prev));

    if (typeof setId === "string") {
        removeQueuedAddSetByTempId(setId);
        refreshPendingQueueCount(sessionId);
        return;
    }

    setDeletingSetById((prev) => ({
        ...prev,
        [setKey]: true,
    }));

    try {
        const res = await apiFetch(`/sets/${setId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Failed to delete set: ${res.status}`);
        }

        clearPendingSet(setId);

        await loadSession(sessionId);
      } catch (err: any) {
        enqueueOrReplaceDeleteSetAction({
            id: `queue-delete-set-${sessionId}-${setId}`,
            type: "delete-set",
            sessionId,
            setId,
            createdAt: Date.now(),
        });

        refreshPendingQueueCount(sessionId);
        clearPendingSet(setId);

        setDeleteSetError("Connection issue. Delete saved offline and will retry.");
      } finally {
        setDeletingSetById((prev) => ({
            ...prev,
            [setKey]: false,
      }));
    }
  }

  function startEditingSet(set: SetEntry, exerciseType: "lift" | "cardio") {
    setEditingSetId(set.id);
    setUpdateSetError(null);

    if (exerciseType === "lift") {
        setEditSetReps(set.reps !== undefined ? String(set.reps) : "");
        setEditSetWeight(set.weight !== undefined ? String(set.weight) : "");
        setEditSetTimeMinutes("");
        setEditSetTimeSeconds("");
        setEditSetIntensity("");
    } else {
        const totalSeconds = set.time_seconds ?? 0;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        setEditSetReps("");
        setEditSetWeight("");
        setEditSetTimeMinutes(minutes > 0 ? String(minutes) : "");
        setEditSetTimeSeconds(seconds > 0 ? String(seconds) : "");
        setEditSetIntensity(set.intensity ?? "");
    }
  }


  async function handleUpdateSet(e: React.FormEvent) {
    e.preventDefault();

    if (editingSetId === null || !session) return;

    setUpdateSetError(null);
    setUpdatingSet(true);

    const setId = editingSetId;

    const payload: {
        reps?: number;
        weight?: number;
        time_seconds?: number | null;
        intensity?: string | null;
    } = {};

    if (editSetReps.trim()) payload.reps = Number(editSetReps);
    if (editSetWeight.trim()) payload.weight = Number(editSetWeight);

    const minutes = editSetTimeMinutes.trim() ? Number(editSetTimeMinutes) : 0;
    const seconds = editSetTimeSeconds.trim() ? Number(editSetTimeSeconds) : 0;

    if (minutes === 0 && seconds === 0) {
        payload.time_seconds = null;
    } else {
      payload.time_seconds = minutes * 60 + seconds;
    }

    if (editSetIntensity.trim() === "") {
        payload.intensity = null;
    } else {
        payload.intensity = editSetIntensity.trim();
    }

    const previousSession = session;

    setSession((prev) => (prev ? updateSetInSession(prev, setId, payload) : prev));

    if (typeof setId === "string") {
            updateQueuedAddSetByTempId(setId, payload);
            refreshPendingQueueCount(sessionId);
            markSetPending(setId);
            setEditingSetId(null);
            setUpdatingSet(false);
            return;
        }

    const realSetId: number = setId;

    try {
        const res = await apiFetch(`/sets/${realSetId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            setSession(previousSession);
            setUpdateSetError(text || `Failed to update set: ${res.status}`);
            return;
        }

        clearPendingSet(realSetId);
        await loadSession(sessionId);
        setEditingSetId(null);
      } catch (err: any) {
        enqueueOrReplaceEditSetAction({
            id: `queue-edit-set-${sessionId}-${realSetId}`,
            type: "edit-set",
            sessionId,
            setId: realSetId,
            payload,
            createdAt: Date.now(),
        });

        refreshPendingQueueCount(sessionId);
        markSetPending(realSetId);

        setUpdateSetError("Connection issue. Saved offline and will retry.");
        setEditingSetId(null);
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

  function startEditingExercise(exercise: ExerciseEntry) {
    setEditingExerciseId(exercise.id);
    setEditExerciseName(exercise.exercise);
    setEditExerciseType(exercise.exercise_type);
    setUpdateExerciseError(null);
  }

  async function handleUpdateExercise(exerciseId: number) {
    if (!sessionId) return;

    setUpdateExerciseError(null);
    setUpdatingExercise(true);

    const payload = {
      exercise: editExerciseName.trim(),
      exercise_type: editExerciseType,
    };

    if (!payload.exercise) {
        setUpdateExerciseError("Exercise name cannot be empty.");
        setUpdatingExercise(false);
        return;
    }

    const previousSession = session;

    setSession((prev) =>
        prev ? updateExerciseInSession(prev, exerciseId, payload) : prev
    );

    try {
      const res = await apiFetch(`/exercises/${exerciseId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setSession(previousSession);
        setUpdateExerciseError(text || `Failed to update exercise: ${res.status}`);
        return;
      }

      clearPendingExercise(exerciseId);

      refreshPendingQueueCount(sessionId);

      await loadSession(sessionId);
      setEditingExerciseId(null);
    } catch (err: any) {
      enqueueOrReplaceEditExerciseAction({
        id: `queue-edit-exercise-${sessionId}-${exerciseId}`,
        type: "edit-exercise",
        sessionId,
        exerciseId,
        payload,
        createdAt: Date.now(),
      });

      refreshPendingQueueCount(sessionId);

      markExercisePending(exerciseId);

      setUpdateExerciseError("Connection issue. Saved offline and will retry.");
      setEditingExerciseId(null);
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
      <Link
        href="/sessions"
        style={{
          display: "inline-block",
          marginBottom: 16,
          textDecoration: "none",
        }}
      >
        ← Back to Sessions
      </Link>

      <div
        style={{
            marginBottom: 16,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #d9d9d9",
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: !isOnline
                ? "#fff7e6"
                : pendingQueueCount > 0
                ? "#fffbe6"
                : "#f6ffed",
            color: "#111",
            fontWeight: 600,
        }}
      >
        {!isOnline
            ? pendingQueueCount > 0
                ? `${pendingQueueCount} ${pendingQueueCount === 1 ? "change" : "changes"} pending — offline, will sync later`
                : "Offline"
            : pendingQueueCount > 0
            ? `${pendingQueueCount} ${pendingQueueCount === 1 ? "change" : "changes"} pending`
            : "All changes synced"}
      </div>

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
        exerciseType={exerciseType}
        setExerciseType={setExerciseType}
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
              editSetTimeMinutes={editSetTimeMinutes}
              setEditSetTimeMinutes={setEditSetTimeMinutes}
              editSetIntensity={editSetIntensity}
              setEditSetIntensity={setEditSetIntensity}
              updateSetError={updateSetError}
              updatingSet={updatingSet}
              handleUpdateSet={handleUpdateSet}
              startEditingSet={startEditingSet}
              handleDeleteSet={handleDeleteSet}
              deletingSetById={deletingSetById}
              pendingSetEditsById={pendingSetEditsById}
              setEditingSetId={setEditingSetId}
              setUpdateSetError={setUpdateSetError}
              editingExerciseId={editingExerciseId}
              editExerciseName={editExerciseName}
              setEditExerciseName={setEditExerciseName}
              editExerciseType={editExerciseType}
              setEditExerciseType={setEditExerciseType}
              updatingExercise={updatingExercise}
              updateExerciseError={updateExerciseError}
              setUpdateExerciseError={setUpdateExerciseError}
              setEditingExerciseId={setEditingExerciseId}
              startEditingExercise={startEditingExercise}
              handleUpdateExercise={handleUpdateExercise}
              handleMoveExercise={handleMoveExercise}
              pendingExerciseEditsById={pendingExerciseEditsById}
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