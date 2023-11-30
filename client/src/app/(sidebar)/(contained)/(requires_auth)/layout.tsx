import { redirect } from "next/navigation";

import { apiUrl } from "@/api/api-url";
import fetchWithToken from "@/api/fetch-with-token";

export default async function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const response = await fetchWithToken(apiUrl("/auth/login"));

  if (!response || !response.ok) {
    redirect("/login");
  }

  return <>{children}</>;
}
