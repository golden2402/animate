import React from "react";

export default function AnimeDataPageLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto max-w-4xl p-8">{children}</div>;
}
