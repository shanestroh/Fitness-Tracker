export default function LoadingSessionsPage() {
  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 20 }}>
        Loading workouts...
      </h1>

      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            height: 80,
            border: "1px solid #d1d5db",
            borderRadius: 12,
            background: "#fff",
          }}
        />
        <div
          style={{
            height: 80,
            border: "1px solid #d1d5db",
            borderRadius: 12,
            background: "#fff",
          }}
        />
        <div
          style={{
            height: 80,
            border: "1px solid #d1d5db",
            borderRadius: 12,
            background: "#fff",
          }}
        />
      </div>
    </main>
  );
}