type SessionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;

  return (
    <main style={{ padding: 20 }}>
      <h1>Session Detail Page</h1>
      <p>Session ID: {id}</p>
    </main>
  );
}