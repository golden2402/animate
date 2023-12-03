"use client";

import { useEffect, useState } from "react";

import { AnimeItemModel } from "@/types/data-models";

import RatingForm from "./_forms/rating";

export default function AnimeDataPage({
  params: { id }
}: {
  params: { id: string };
}) {
  const [animeData, setAnimeData] = useState<AnimeItemModel | undefined>();

  useEffect(() => {
    async function getAnime() {
      const response = await fetch(`/api/anime/${id}`);

      if (response.ok) {
        setAnimeData(await response.json());
      }
    }

    getAnime();
  }, [id]);

  // if we have no id, then this request failed:
  if (animeData) {
    const { id } = animeData;

    if (!id) {
      // 404:
      return (
        <section className="gap-4 p-6 rounded fg fg-outline fg-shadow">
          <h1 className="text-3xl font-semibold">Oh no!</h1>
          <p className="text-sm text-neutral-500">
            We tried to find this anime for you, but it looks like it
            doesn&apos;t exist in our records!&nbsp;
            <span className="text-blue-500">Is this a mistake?</span>
          </p>
        </section>
      );
    }

    const { title, episodes, ratings, reviews } = animeData;
    // composed attributes:
    const ratingPopulation = ratings.length;

    return (
      <div className="flex flex-col gap-4">
        <section>
          <h1 className="text-xl font-medium">Information</h1>
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow">
              <h1 className="text-3xl font-semibold">{title}</h1>
              <div>
                <h2 className="font-medium">Episodes</h2>
                <p className="text-sm text-neutral-500">{episodes || "N/A"}</p>
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
                      by {ratingPopulation} user{ratingPopulation !== 1 && "s"}.
                    </p>
                  </>
                ) : (
                  <p className="text-sm">
                    Nobody has rated this anime yet!&nbsp;
                    <span className="text-blue-500">Be the first:</span>
                  </p>
                )}
              </div>

              <form
                className="
                flex flex-col gap-2
                p-6
                rounded
                fg fg-outline"
              >
                <RatingForm animeUrlId={id} />
              </form>
            </section>
          </div>
        </section>

        <section>
          <h1 className="text-xl font-medium">Reviews</h1>
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow">
              <div>
                <h2 className="font-medium">Leave a Review</h2>
                <p className="text-sm text-neutral-500">
                  Have you watched {title}? Let everyone know what you thought
                  about it!
                </p>
              </div>

              <div></div>
            </section>

            <section className="flex flex-col gap-2 p-6 rounded fg fg-outline fg-shadow">
              <h2>Here&apos;s what everyone is saying:</h2>
              {reviews.map((review, i) => {
                const userRating = ratings.find(
                  (rating) => rating.user_id === review.user_id
                );

                return (
                  <div
                    className="flex flex-col gap-2 p-4 rounded fg fg-outline"
                    key={`review-card-${i}`}
                  >
                    <section className="flex flex-col gap-2">
                      <div className="flex flex-col gap-0.5">
                        <h2>{review.user_id} says...</h2>
                        <p className="p-2 text-sm rounded fg-outline">
                          {review.post}
                        </p>
                      </div>

                      {userRating && (
                        <div>
                          <h2>{review.user_id}&apos;s rating:</h2>
                          <p className="text-3xl font-semibold">
                            {userRating.rate_score.toFixed(1)}
                          </p>
                        </div>
                      )}
                    </section>
                  </div>
                );
              })}
            </section>
          </div>
        </section>
      </div>
    );
  }

  // loading:
  return (
    <section className="gap-4 p-6 rounded fg fg-outline fg-shadow">
      <h1 className="text-3xl font-semibold">Hang tight...</h1>
      <p className="text-sm text-neutral-500">
        Our highly trained team of monkeys are getting this for you.
      </p>
    </section>
  );
}
