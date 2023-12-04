"use client";

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  LinearScale,
  CategoryScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "chartjs-adapter-moment";

import { AnimeItemModel } from "@/types/data-models";

import RatingForm from "./_forms/rating";
import ReviewForm from "./_forms/review";

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  LinearScale,
  CategoryScale,
  BarElement,
  TimeScale
);

const timezoneOffset = new Date().getTimezoneOffset() * 60000;

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

    const { title, blurb, episodes, ratings, reviews } = animeData;
    // composed attributes:
    const ratingPopulation = ratings.length;

    const ratingsChartDataMap = ratings
      .toSorted(
        ({ rate_date: dateA }, { rate_date: dateB }) =>
          new Date(dateA).getTime() - new Date(dateB).getTime()
      )
      .reduce((map, { rate_date, rate_score }) => {
        const dateTimestamp = new Date(rate_date).getTime();

        return map.set(dateTimestamp, [
          ...(map.get(dateTimestamp) || []),
          {
            x: dateTimestamp,
            y: rate_score
          }
        ]);
      }, new Map<number, { x: number; y: number }[]>());
    const ratingsLineChartData = Array.from(ratingsChartDataMap.keys())
      .map((key) => {
        const dataSet = ratingsChartDataMap.get(key)!;

        return {
          x: key + timezoneOffset,
          y:
            dataSet.reduce((last, dataPoint) => last + dataPoint.y, 0) /
            dataSet.length
        };
      })
      .filter(Boolean);

    const ratingsBarChartData = ratings.reduce((chartData, rating) => {
      chartData[Math.floor(rating.rate_score) - 1]++;
      return chartData;
    }, Array(10).fill(0));

    return (
      <div className="flex flex-col gap-4">
        <section>
          <h1 className="text-xl font-medium">Information</h1>
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow">
              <h1 className="text-3xl font-semibold">{title}</h1>

              <div>
                <h2 className="font-medium">Synopsis</h2>
                <p className="text-sm text-neutral-500">{blurb || "N/A"}</p>
              </div>

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
                  <p className="text-sm text-neutral-500">
                    Nobody has rated this anime yet! Want to be the first?
                  </p>
                )}
              </div>

              <div>
                <h2 className="font-medium">Average Rating History</h2>
                <div className="h-64">
                  <Line
                    className="w-full"
                    data={{
                      datasets: [
                        {
                          label: "Score",
                          data: ratingsLineChartData,
                          tension: 0,
                          backgroundColor: "#22c55e",
                          borderColor: "#16a34a"
                        }
                      ]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          type: "time",
                          time: {
                            unit: "day"
                          }
                        },
                        y: {
                          min: 1,
                          max: 10
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <h2 className="font-medium">Total Ratings</h2>
                <div className="h-64">
                  <Bar
                    className="w-full"
                    data={{
                      labels: Array.from(Array(11).keys()).slice(1),
                      datasets: [
                        {
                          label: "Ratings",
                          data: ratingsBarChartData,
                          backgroundColor: [
                            "#ef4444",
                            "#ef4444",
                            "#f97316",
                            "#f97316",
                            "#f97316",
                            "#facc15",
                            "#facc15",
                            "#facc15",
                            "#22c55e",
                            "#22c55e"
                          ],
                          borderColor: [
                            "#dc2626",
                            "#dc2626",
                            "#ea580c",
                            "#ea580c",
                            "#ea580c",
                            "#eab308",
                            "#eab308",
                            "#eab308",
                            "#16a34a",
                            "#16a34a"
                          ]
                        }
                      ]
                    }}
                    options={{
                      maintainAspectRatio: false
                    }}
                  />
                </div>
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

              <form
                className="
                flex flex-col gap-2
                p-6
                rounded
                fg fg-outline"
              >
                <ReviewForm animeUrlId={id} />
              </form>
            </section>

            <section className="flex flex-col gap-2 p-6 rounded fg fg-outline fg-shadow">
              <h2>Here&apos;s what everyone is saying:</h2>
              {reviews.length > 0 ? (
                reviews.map((review, i) => {
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
                          <h2>{review.username} says...</h2>
                          <p className="p-2 text-sm rounded fg-outline">
                            {review.post}
                          </p>
                        </div>

                        {userRating && (
                          <div>
                            <h2>{review.username}&apos;s rating:</h2>
                            <p className="text-3xl font-semibold">
                              {userRating.rate_score.toFixed(1)}
                            </p>
                          </div>
                        )}
                      </section>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-neutral-500">
                  Nobody&apos;s made a review yet. Get the first word in!
                </p>
              )}
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
