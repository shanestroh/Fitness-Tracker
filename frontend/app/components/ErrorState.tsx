type ErrorStateProps = {
  title?: string;
  message: string;
  action?: React.ReactNode;
};

export default function ErrorState({
  title = "Something went wrong",
  message,
  action,
}: ErrorStateProps) {
  return (
    <section className="section-card">
      <div style={{ display: "grid", gap: 10 }}>
        <h2
          className="section-heading section-heading-md"
          style={{ margin: 0 }}
        >
          {title}
        </h2>

        <p
          className="danger-text"
          style={{
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        {action ? <div style={{ marginTop: 4 }}>{action}</div> : null}
      </div>
    </section>
  );
}