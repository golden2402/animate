import Sidebar from "@/components/sidebar";

export default function SidebarLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      {children}
    </div>
  );
}
