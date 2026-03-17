import Link from "next/link";

type SessionCardProps = {
  id: number;
  split: string;
  date: string;
  notes?: string;
  exerciseCount: number;
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
            {formatDate(date)}
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