"use client";

import { redirect } from "next/navigation";

import fetchWithToken from "@/util/api/fetch-with-token";

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  (async () => {
    const response = await fetchWithToken("/api/account/login");
  
    if (!response || !response.ok) {
      redirect("/login");
    }
  })();

  return <>{children}</>;
}
