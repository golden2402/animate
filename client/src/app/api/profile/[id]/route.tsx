import { UserDataModel, UserItemResponseModel } from "@/types/data-models";
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

      const filteredResponse: UserDataModel = {
        ...userDataBody,
        reviews: userReviewsBody,
        ratings: userRatingsBody
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
