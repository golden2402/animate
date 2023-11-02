import joinClasses from "@/util/join-classes";

export default function Field({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={joinClasses(
        "p-2 w-full fg fg-outline rounded text-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
