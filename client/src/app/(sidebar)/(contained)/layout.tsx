export default function ContainedPageLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto">{children}</div>;
}
