type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <section
      style={{
        textAlign: "center",
        padding: "36px 20px",
        border: "1px dashed var(--border-strong)",
        borderRadius: 18,
        background: "var(--surface-alt)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "var(--text)",
        }}
      >
        {title}
      </h2>

      {description ? (
        <p
          style={{
            margin: "10px auto 0",
            maxWidth: 480,
            color: "var(--text-muted)",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      ) : null}

      {action ? <div style={{ marginTop: 18 }}>{action}</div> : null}
    </section>
  );
}