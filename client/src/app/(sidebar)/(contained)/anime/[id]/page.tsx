"use client";

import { useEffect, useRef } from "react";

import { AnimeItemModel, AnimeItemResponseModel } from "@/types/data-models";
import Link from "next/link";

export default function AnimeDataPage({
  params: { id }
}: {
  params: { id: string };
}) {
  const animeDataRef = useRef<AnimeItemModel | undefined>(undefined);

  useEffect(() => {
    async function getAnime() {
      const response = await fetch(`/api/anime/${id}`);

      if (response.ok) {
        animeDataRef.current = await response.json();
      }
    }

    getAnime();
  }, [id]);

  if (animeDataRef.current) {
    const { title, episodes, ratings } = animeDataRef.current;
    const ratingPopulation = ratings.length;

    return (
      <div className="">
        <div className="flex flex-col gap-4">
          <section></section>

          <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <div>
              <h2 className="font-medium">Episodes</h2>
              <p className="text-sm text-neutral-500">
                {episodes || "N/A"}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow">
            <div>
              <h2 className="font-medium">Rating</h2>
              {ratingPopulation > 0 ? (
                <>
                  <p className="text-3xl font-semibold">
                    {(
                      ratings.reduce(
                        (last, { rate_score }) => last + rate_score,
                        0
                      ) / ratingPopulation
                    ).toFixed(1)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    by {ratingPopulation} user{ratingPopulation === 1 && "s"}.
                  </p>
                </>
              ) : (
                <p className="text-sm">
                  Nobody has rated this anime yet!{" "}
                  <Link className="text-blue-500" href="">
                    Be the first.
                  </Link>
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // 404:
  return (
    <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow"></section>
  );
}
