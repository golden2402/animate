import { AnimeItemResponseModel, NamedWatchItemResponseModel, UserDataModel, UserItemResponseModel, WatchItemResponseModel } from "@/types/data-models";
import { apiUrl } from "@/util/api/api-url";
import serverErrorResponseModel from "@/util/api/error-response";

export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const userData = await fetch(apiUrl(`/user/${id}`));
    const userDataBody: UserItemResponseModel = await userData.json();

    if (userDataBody) {
      const userReviews = await fetch(apiUrl(`/review/${id}`));
      const userReviewsBody = await userReviews.json();

      const userRatings = await fetch(apiUrl(`/rating/${id}`));
      const userRatingsBody = await userRatings.json();

      const userWatchList = await fetch(apiUrl(`/watch/${id}`));
      const userWatchListBody: WatchItemResponseModel[] = await userWatchList.json();

      let filteredWatchList: NamedWatchItemResponseModel[] = [];
      for (const watchItem of userWatchListBody) {
        const animeData = await fetch(apiUrl(`/anime/${watchItem.anime_id}`));
        const animeDataBody: AnimeItemResponseModel[] = await animeData.json();

        if (animeDataBody) {
          filteredWatchList.push({
            ...watchItem,
            anime_name: animeDataBody[0].title
          });
        }
      }

      const filteredResponse: UserDataModel = {
        ...userDataBody,
        reviews: userReviewsBody,
        ratings: userRatingsBody,
        watchList: filteredWatchList,
      };

      return Response.json(filteredResponse);
    }
  } catch (e: any) {
    if (e instanceof Error) {
      console.error(`Route handler threw: ${e}`);
    }
  }

  return Response.json(serverErrorResponseModel, { status: 500 });
}
