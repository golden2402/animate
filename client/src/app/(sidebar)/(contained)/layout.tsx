import Header from "@/components/header";

export default function ContainedPageLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex-grow">
      <Header />
      <main className="mx-auto max-w-6xl p-4">{children}</main>
      {/* TODO: footer? */}
    </section>
  );
}
