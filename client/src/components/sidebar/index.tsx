import Link from "next/link";

// TODO: revise these:
import ChevronUpIcon from "@/components/icons/ChevronUpIcon";
import FileSearchIcon from "@/components/icons/FileSearchIcon";
import FolderIcon from "@/components/icons/FolderIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import StarIcon from "@/components/icons/StarIcon";
import TagIcon from "@/components/icons/TagIcon";
import UserIcon from "@/components/icons/UserIcon";

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
        px-1.5 py-1
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
      sticky top-0 w-72 h-screen
      flex-none
      flex flex-col justify-between
      fg fg-shadow"
    >
      {/* navigation: */}
      <nav className="flex flex-col gap-4 p-4">
        {/* search: */}
        <div
          className="
          flex justify-between gap-1 items-center
          p-1
          rounded
          outline outline-1 outline-black/20"
        >
          <input
            className="bg-transparent w-full h-6 px-1 text-sm"
            placeholder="Search"
          />
          <SearchIcon className="w-5" />
        </div>

        {/* quick access (home): */}
        <SidebarLink href="/">
          <div className="flex gap-1 items-center">
            <HomeIcon className="w-5" />
            <p className="text-sm">Home</p>
          </div>
        </SidebarLink>

        {/* categories: */}
        <SidebarCategory title="Featured">
          <SidebarLink href="/season">
            <div className="flex gap-1.5 items-center">
              <StarIcon className="w-5" />
              <p className="text-sm">Fall 2023</p>
            </div>
          </SidebarLink>
        </SidebarCategory>
        <SidebarCategory title="Browse">
          {/* TODO: fill out! */}
          <SidebarLink href="/">
            <div className="flex gap-1.5 items-center">
              <FileSearchIcon className="w-5" />
              <p className="text-sm">Anime</p>
            </div>
          </SidebarLink>
          <SidebarLink href="/">
            <div className="flex gap-1.5 items-center">
              <FolderIcon className="w-5" />
              <p className="text-sm">Seasons</p>
            </div>
          </SidebarLink>
          <SidebarLink href="/">
            <div className="flex gap-1.5 items-center">
              <TagIcon className="w-5" />
              <p className="text-sm">Genres</p>
            </div>
          </SidebarLink>
        </SidebarCategory>
      </nav>

      {/* user: */}
      <section className="border-t-[1px] border-black/10">
        <button className="p-4 w-full flex justify-between">
          <div className="flex gap-1 items-center">
            <UserIcon className="w-5" />
            <p className="text-sm font-medium">OnlyTwentyCharacters</p>
          </div>
          <ChevronUpIcon />
        </button>
      </section>
    </aside>
  );
}
