"use client";

import { useRouter } from "next/navigation";

import fetchWithToken from "@/util/api/fetch-with-token";

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  (async () => {
    const response = await fetchWithToken("/api/account/login");

    if (!response || !response.ok) {
      router.push("/login");
    }
  })();

  return <>{children}</>;
}
