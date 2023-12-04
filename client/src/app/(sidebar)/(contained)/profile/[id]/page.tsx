"use client";

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import { UserDataModel } from "@/types/data-models";

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  LinearScale,
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

    const { username, user_color, ratings, reviews } = userData;
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

    console.log(user_color);

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

            <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow"></section>

            <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow">
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
