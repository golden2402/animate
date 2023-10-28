export default function ContainedPageLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-grow">
      <div className="mx-auto max-w-6xl p-4">{children}</div>
    </main>
  );
}
