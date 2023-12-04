"use client";

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { RatingItemResponseModel } from "@/types/data-models";

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  LinearScale,
  CategoryScale,
  BarElement
);

export default function ReportingPage() {
  const [ratingData, setRatingData] = useState<
    RatingItemResponseModel[] | undefined
  >();

  useEffect(() => {
    async function getProfile() {
      const response = await fetch(`/api/rating`);

      if (response.ok) {
        setRatingData(await response.json());
      }
    }

    getProfile();
  }, []);

  if (ratingData) {
    const ratingsBarChartData = ratingData.reduce((chartData, rating) => {
      chartData[Math.floor(rating.rate_score) - 1]++;
      return chartData;
    }, Array(10).fill(0));

    return (
      <div className="flex flex-col gap-4">
        <section>
          <h1 className="text-xl font-medium">Managerial Statistics</h1>
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-4 p-6 rounded fg fg-outline fg-shadow">
              <h2 className="font-medium">Anime Rating Count</h2>
              <Bar
                className="w-full h-36"
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
                  // maintainAspectRatio: false
                }}
              />
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
