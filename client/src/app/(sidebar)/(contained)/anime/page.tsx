"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useCallback, useEffect, useState } from "react";

import {
  AnimeItemModel,
  SeasonItemResponseModel,
  WatchItemResponseModel
} from "@/types/data-models";

import SearchIcon from "@/components/icons/SearchIcon";

import joinClasses from "@/util/join-classes";
import fetchWithToken from "@/util/api/fetch-with-token";

export default function DisplayAnime() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const year = searchParams.get("year");

  const [seasons, setSeasons] = useState<SeasonItemResponseModel[]>([]);
  const [current, setCurrent] = useState<SeasonItemResponseModel>({
    season_year: year || "",
    season_name: name || ""
  });
  const [animes, setAnimes] = useState<AnimeItemModel[]>();

  useEffect(() => {
    async function getSeasons() {
      const response = await fetch(`/api/season`);

      if (response.ok) {
        setSeasons(await response.json());
      }
    }

    async function getAnimes() {
      const response = await fetch(`/api/anime/`);

      if (response.ok) {
        setAnimes(await response.json());
      }
    }

    getSeasons();
    getAnimes();
  }, []);

  const getAnimeBySeason = useCallback(() => {
    let temp = seasons.filter((season) => {
      return (
        season.season_name === current?.season_name &&
        season.season_year == current?.season_year
      );
    });

    async function getAnimeBySeason(id: number | undefined) {
      const response = await fetch(`/api/anime/seasons/${id}`);

      if (response.ok) {
        setAnimes(await response.json());
      }
    }

    if (temp && temp.length > 0) {
      getAnimeBySeason(temp[0].id);
    }
  }, [current?.season_name, current?.season_year, seasons]);

  useEffect(() => {
    if (name || year) {
      getAnimeBySeason();
    }
  }, [getAnimeBySeason, name, year])

  function addAnimeToWatchList(anime: AnimeItemModel) {
    async function watchAnime(watch: WatchItemResponseModel) {
      const response = await fetchWithToken(`/api/anime/watch`, {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(watch)
      });

      if (response.ok) {
        const tempAnime = animes?.filter((anime2) => {
          if (anime.id == anime2.id) {
            anime.watched = true;
          }
          return anime2;
        });
        console.log(tempAnime);
        setAnimes(tempAnime);
      }
    }

    async function updateWatch(watch: WatchItemResponseModel) {
      const response = await fetchWithToken(`/api/anime/watch`, {
        headers: {
          "content-type": "application/json"
        },
        method: "DELETE",
        body: JSON.stringify(watch)
      });
      const tempAnime = animes?.filter((anime2) => {
        if (anime.id == anime2.id) {
          anime.watched = false;
        }
        return anime2;
      });
      setAnimes(tempAnime);
    }

    const watch: WatchItemResponseModel = {
      anime_id: anime.id,
      watch_date: new Date().toISOString()
    };
    if (anime.watched) {
      updateWatch(watch);
    } else {
      watchAnime(watch);
    }
  }

  return (
    <div>
      <div className="flex flex-row gap-2">
        <div
          className="
          flex justify-between gap-1 items-center
          w-full
          p-1
          rounded
          outline outline-1 outline-black/20"
        >
          <div className="flex w-full">
            <input
              className="bg-transparent w-full h-6 px-1 text-sm"
              onChange={(e) =>
                setCurrent({
                  ...current,
                  season_name: e.target.value
                })
              }
              value={current?.season_name}
              placeholder="Season Name"
            />

            <input
              className="bg-transparent w-full h-6 px-1 text-sm"
              onChange={(e) =>
                setCurrent({
                  ...current,
                  season_year: e.target.value
                })
              }
              value={current?.season_year}
              type="number"
              placeholder="Season Year"
            />
          </div>
        </div>

        <button
          className="flex items-center gap-1 py-1 px-2 rounded bg-blue-500 text-neutral-100 outline outline-1 outline-black/20 text-sm font-medium"
          onClick={() => getAnimeBySeason()}
        >
          <p>Search</p>
          <SearchIcon className="w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-8">
        {animes?.slice(0, 500).map((anime, i) => {
          return (
            <div
              key={i}
              className="flex flex-col gap-2 p-6 rounded fg fg-outline fg-shadow"
            >
              <div>
                <Link href={`/anime/${anime.id}`}>
                  <h1 className="text-xl font-semibold underline">
                    {anime.title}
                  </h1>
                </Link>
                <p className="text-sm font-medium">
                  Episodes: {anime.episodes ? anime.episodes : "N/A"}
                </p>
              </div>

              {anime.blurb && (
                <p className="text-sm p-2 rounded fg fg-outline">
                  {anime.blurb}
                </p>
              )}

              <button
                className={joinClasses(
                  "p-1 rounded fg-outline text-neutral-50",
                  anime.watched ? "bg-red-500" : "bg-green-500"
                )}
                onClick={() => addAnimeToWatchList(anime)}
              >
                {anime.watched ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
