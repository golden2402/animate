import { redirect } from "next/navigation";

import fetchWithToken from "@/util/api/fetch-with-token";
import { apiUrl } from "@/util/api/api-url";

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
