"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import fetchWithToken from "@/util/api/fetch-with-token";

export default function AccountFormLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // if we have an existing access token, just go back to the home page:
  (async () => {
    const { ok: isAuthenticated } = await fetchWithToken("/api/account/login");

    if (isAuthenticated) {
      router.push("/");
    }
  })();

  return (
    <div
      className="
      mx-auto max-w-md w-full h-min 
      flex flex-col gap-2"
    >
      <Link className="text-blue-500" href="/home">
        <p>Home</p>
      </Link>

      {children}
    </div>
  );
}
