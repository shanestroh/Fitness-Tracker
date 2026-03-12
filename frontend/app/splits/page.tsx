import Link from "next/link";

const splits = ["Push", "Pull", "Legs", "Shoulders", "Cardio"];

export default function SplitsPage() {
  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
        Browse by Split
      </h1>

      <div style={{ display: "grid", gap: 12 }}>
        {splits.map((split) => (
          <Link
            key={split}
            href={`/splits/${split.toLowerCase()}`}
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 12,
              textDecoration: "none",
              display: "block",
            }}
          >
            {split}
          </Link>
        ))}
      </div>
    </main>
  );
}