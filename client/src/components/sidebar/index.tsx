import Link from "next/link";

function SidebarLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <div
        className="
        px-2 py-1
        fg rounded
        transition-colors hover:fg-focus duration-200"
      >
        {children}
      </div>
    </Link>
  );
}

function SidebarCategory({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-1">
      <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
      {children}
    </section>
  );
}

export default function Sidebar() {
  return (
    <aside
      className="
      sticky top-0 w-72 h-screen p-4
      flex-none
      flex flex-col justify-between
      fg fg-shadow"
    >
      {/* navigation: */}
      <nav className="flex flex-col gap-4">
        {/* search: */}
        <div
          className="
          flex justify-between items-center
          px-2 py-1
          rounded
          outline outline-1 outline-black/20"
        >
          <input
            className="bg-transparent w-full h-6 text-sm"
            placeholder="Search"
          />
          <p>O</p>
        </div>
        {/* categories: */}
        <SidebarCategory title="Featured">
          <SidebarLink href="/season">
            <p className="text-sm font-medium">Fall 2023</p>
          </SidebarLink>
        </SidebarCategory>
        <SidebarCategory title="Browse">
          {/* TODO: fill out! */}
        </SidebarCategory>
      </nav>

      {/* user: */}
      <section></section>
    </aside>
  );
}
