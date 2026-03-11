"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ExerciseHistoryPage() {
  const { name } = useParams();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `http://localhost:8000/exercises/history/${name}`
      );
      const data = await res.json();
      setHistory(data);
    }

    load();
  }, [name]);

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        {name} History
      </h1>

      {history.map((entry, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 14,
            marginTop: 14
          }}
        >
          {entry.sets.map((s, idx) => (
            <div key={idx}>
              {s.weight} × {s.reps}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}