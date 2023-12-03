import { apiUrl } from "@/util/api/api-url";
import serverErrorResponseModel from "@/util/api/error-response";

import {
  AnimeItemModel,
  AnimeItemResponseModel,
  AnimeProducerResponseModel,
  GenreItemResponseModel,
  ProducerItemResponseModel,
  RatingItemResponseModel,
  ReviewItemResponseModel
} from "@/types/data-models";

const revalidationSettings = {};

export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const animeItemResponse = await fetch(
      apiUrl(`/anime/${id}`),
      revalidationSettings
    );
    const animeItemResponseBody: AnimeItemResponseModel[] =
      await animeItemResponse.json();

    if (animeItemResponseBody) {
      const genreResponse = await fetch(
        apiUrl(`/genre/anime/${id}`),
        revalidationSettings
      );
      const genreResponseBody: GenreItemResponseModel[] =
        await genreResponse.json();

      const producerResponse = await fetch(
        apiUrl(`/producer/anime/${id}`),
        revalidationSettings
      );
      const producerResponseBody: AnimeProducerResponseModel[] =
        await producerResponse.json();

      let producers: ProducerItemResponseModel[] = [];
      if (producerResponseBody) {
        for (const { producer_id } of producerResponseBody) {
          const producerDataResponse = await fetch(
            apiUrl(`/producer/${producer_id}`),
            revalidationSettings
          );
          const producerDataResponseBody: ProducerItemResponseModel =
            await producerDataResponse.json();

          if (producerDataResponseBody) {
            producers.push(producerDataResponseBody);
          }
        }
      }

      const ratingsResponse = await fetch(
        apiUrl(`/rating/anime/${id}`),
        revalidationSettings
      );
      const ratingsResponseBody: RatingItemResponseModel[] =
        await ratingsResponse.json();

      const reviewsResponse = await fetch(
        apiUrl(`/review/anime/${id}`),
        revalidationSettings
      );
      const reviewsResponseBody: ReviewItemResponseModel[] =
        await reviewsResponse.json();

      const animeFilteredResponse: AnimeItemModel = {
        ...animeItemResponseBody[0],
        genres: genreResponseBody,
        studios: producers,
        ratings: ratingsResponseBody,
        reviews: reviewsResponseBody
      };

      return Response.json(animeFilteredResponse);
    }
  } catch (e: any) {
    if (e instanceof Error) {
      console.error(`Route handler threw: ${e}`);
    }
  }

  return Response.json(serverErrorResponseModel, { status: 500 });
}
