export default function AccountFormLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="
      mx-auto
      max-w-md
      w-full h-min
      rounded
      fg fg-outline fg-shadow"
    >
      {children}
    </section>
  );
}
