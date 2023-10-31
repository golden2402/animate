export default function FullscreenLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-grow flex flex-col justify-center">{children}</main>
  );
}
