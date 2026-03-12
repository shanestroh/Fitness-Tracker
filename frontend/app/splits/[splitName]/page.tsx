type Props = {
  params: Promise<{
    splitName: string;
  }>;
};

export default async function SplitDetailPage({ params }: Props) {
  const { splitName } = await params;

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        {decodeURIComponent(splitName.upper()} Workouts
      </h1>
    </main>
  );
}