type LoadingStateProps = {
  title?: string;
  description?: string;
};

export default function LoadingState({
  title = "Loading...",
  description,
}: LoadingStateProps) {
  return (
    <section className="section-card">
      <div style={{ display: "grid", gap: 10 }}>
        <h2
          className="section-heading section-heading-md"
          style={{ margin: 0 }}
        >
          {title}
        </h2>

        {description ? (
          <p
            className="muted-copy"
            style={{
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}