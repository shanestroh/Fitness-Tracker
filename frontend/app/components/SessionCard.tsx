import Link from "next/link";
import { formatWorkoutDate } from "@/lib/formatDate";

type SessionCardProps = {
  id: number;
  split: string;
  date: string;
  notes?: string;
  exerciseCount: number;
};

export default function SessionCard({
  id,
  split,
  date,
  notes,
  exerciseCount,
}: SessionCardProps) {
  return (
    <Link
      href={`/sessions/${id}`}
      className="surface-card"
      style={{
        display: "block",
        padding: 18,
        textDecoration: "none",
        transition:
          "transform 0.08s ease, box-shadow 0.15s ease, border-color 0.15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 260px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.2,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              {split}
            </h2>

            <span className="badge badge-neutral">
              {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
            </span>
          </div>

          {notes ? (
            <p
              style={{
                margin: 0,
                color: "var(--text-muted)",
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              {notes}
            </p>
          ) : (
            <p
              style={{
                margin: 0,
                color: "var(--text-muted)",
                fontSize: 15,
              }}
            >
              No notes added
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            justifyItems: "end",
            gap: 8,
          }}
        >
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {formatWorkoutDate(date, "short")}
          </span>

          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--primary)",
            }}
          >
            Open session →
          </span>
        </div>
      </div>
    </Link>
  );
}