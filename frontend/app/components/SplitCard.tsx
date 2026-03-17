import Link from "next/link";

type SplitCardProps = {
  splitKey: string;
  splitName: string;
  sessionCount: number;
  lastWorkoutDate: string;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${month} ${day}${suffix}, ${year}`;
}

export default function SplitCard({
  splitKey,
  splitName,
  sessionCount,
  lastWorkoutDate,
}: SplitCardProps) {
  return (
    <Link
      href={`/splits/${encodeURIComponent(splitKey)}`}
      className="surface-card"
      style={{
        display: "block",
        padding: 18,
        textDecoration: "none",
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
        <div style={{ minWidth: 0, flex: "1 1 220px" }}>
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
              {splitName}
            </h2>

            <span className="badge badge-neutral">
              {sessionCount} {sessionCount === 1 ? "workout" : "workouts"}
            </span>
          </div>

          <p
            className="muted-copy"
            style={{
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Last workout: {formatDate(lastWorkoutDate)}
          </p>
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
              fontSize: 14,
              fontWeight: 700,
              color: "var(--primary)",
            }}
          >
            Open split →
          </span>
        </div>
      </div>
    </Link>
  );
}