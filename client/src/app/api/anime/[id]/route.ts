import { apiUrl } from "@/util/api/api-url";
import serverErrorResponseModel from "@/util/api/error-response";

import {
  AnimeItemModel,
  AnimeItemResponseModel,
  AnimeProducerResponseModel,
  GenreItemResponseModel,
  ProducerItemResponseModel
} from "@/types/data-models";

export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const animeItemResponse = await fetch(apiUrl(`/anime/${id}`));
    const animeItemResponseBody: AnimeItemResponseModel[] =
      await animeItemResponse.json();

    if (animeItemResponseBody) {
      const genreResponse = await fetch(apiUrl(`/genre/anime/${id}`));
      const genreResponseBody: GenreItemResponseModel[] =
        await genreResponse.json();

      const producerResponse = await fetch(apiUrl(`/producer/anime/${id}`));
      const producerResponseBody: AnimeProducerResponseModel[] =
        await producerResponse.json();

      let producers: ProducerItemResponseModel[] = [];
      if (producerResponseBody) {
        for (const { producer_id } of producerResponseBody) {
          const producerDataResponse = await fetch(
            apiUrl(`/producer/${producer_id}`)
          );
          const producerDataResponseBody: ProducerItemResponseModel =
            await producerDataResponse.json();

          if (producerDataResponseBody) {
            producers.push(producerDataResponseBody);
          }
        }
      }

      const animeFilteredResponse: AnimeItemModel = {
        ...animeItemResponseBody[0],
        genres: genreResponseBody || [],
        producers: producers || []
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
