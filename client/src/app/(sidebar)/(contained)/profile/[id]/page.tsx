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

import { UserDataModel } from "@/types/data-models";

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

export default function ProfileDataPage({
  params: { id }
}: {
  params: { id: number };
}) {
  const [userData, setUserData] = useState<UserDataModel | undefined>();

  useEffect(() => {
    async function getProfile() {
      const response = await fetch(`/api/profile/${id}`);

      if (response.ok) {
        setUserData(await response.json());
      }
    }

    getProfile();
  }, [id]);

  // if we have no id, then this request failed:
  if (userData) {
    const { id } = userData;

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

    const { username, display_name, blurb, user_color, ratings, reviews } =
      userData;
    // because asyncpg keeps giving me "None" as a string, so just force over
    // it:
    const fixedDisplayName = display_name === "None" ? null : display_name;

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
    const ratingsChartData = Array.from(ratingsChartDataMap.keys())
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
            <section
              className={`flex flex-col gap-4 h-32 p-6 rounded fg fg-outline fg-shadow`}
              // had to use this for some reason:
              style={{ backgroundColor: `#${user_color}` }}
            />

            <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow">
              <div>
                <h1 className="text-2xl font-semibold">
                  {fixedDisplayName || username}
                </h1>
                {fixedDisplayName && (
                  <p className="text-sm text-neutral-500">{username}</p>
                )}
              </div>

              {blurb && (
                <div>
                  <p className="p-2 text-sm rounded fg-outline">{blurb}</p>
                </div>
              )}
            </section>

            <section className="flex flex-col gap-4 p-12 rounded fg fg-outline fg-shadow">
              <h2 className="font-medium">Rating History</h2>
              <div>
                <h2 className="font-medium">Average Rating History</h2>
                <div className="h-64">
                  <Line
                    className="w-full"
                    data={{
                      datasets: [
                        {
                          label: "Score",
                          data: ratingsChartData,
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
            </section>
          </div>
        </section>

        <section>
          <h1 className="text-xl font-medium">Reviews</h1>
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-2 p-6 rounded fg fg-outline fg-shadow">
              <h2>{username}&apos;s reviews:</h2>
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
                        <h2>
                          For <span className="font-bold">{}</span>
                        </h2>
                        <p className="p-2 text-sm rounded fg-outline">
                          {review.post}
                        </p>
                      </div>

                      {userRating && (
                        <div>
                          <h2>{username}&apos;s rating:</h2>
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



        <section>
          <h1 className="text-xl font-medium">Watch List</h1>
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-2 p-6 rounded fg fg-outline fg-shadow">
              <h2>{username}&apos;s Watch List:</h2>
              {userData.watchList.map((review, i) => {
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
                        <h2>
                          For <span className="font-bold">{review.anime_name}</span>
                        </h2>
                        <p className="p-2 text-sm rounded fg-outline">
                          {review.watch_date}
                        </p>
                      </div>
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
