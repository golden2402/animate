"use client"

import { useEffect, useState } from "react"
import { AnimeItemModel, SeasonItemResponseModel } from "@/types/data-models"

export default function DisplayAnime() {
    const [seasons, setSeasons] = useState<SeasonItemResponseModel[]>([]);
    const [current, setCurrent] = useState<SeasonItemResponseModel>({
        season_year: "",
        season_name: ""
    });
    const [animes, setAnimes] = useState<AnimeItemModel[]>()

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



    function getAnimeBySeason() {
        let temp = seasons.filter((season) => {
            return season.season_name === current?.season_name && season.season_year == current?.season_year
        })
        

        async function getAnimeBySeason(id: number | undefined) {
            const response = await fetch(`/api/anime/seasons/${id}`);

            if (response.ok) {
                setAnimes(await response.json());
            }
        }
        getAnimeBySeason(temp[0].id)
    }

    return (
        <div>
            <div className="flex flex-row mx-5">
                <input onChange={(e) => setCurrent({
                    ...current,
                    season_name: e.target.value
                })} value={current?.season_name} placeholder="Season Name"></input>

                <input onChange={(e) => setCurrent({
                    ...current,
                    season_year: e.target.value
                })
                } value={current?.season_year} type="number" placeholder="Season Year"></input>

                <button onClick={() => getAnimeBySeason()}>Search</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
                {animes?.slice(0, 500).map((anime, i) => {
                    return (
                        <div key={i} className="items-center flex-col outline-2  bg-neutral-300 w-44 h-40">
                            <h1 className="text-lg font-bold">{anime.title}</h1>
                            <p className="text-sm font-medium">Episode Count: {anime.episodes ? anime.episodes : "N/A"}</p>
                            <p>{anime.blurb}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}