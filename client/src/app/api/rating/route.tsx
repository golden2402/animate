import { apiUrl } from "@/util/api/api-url";
import serverErrorResponseModel from "@/util/api/error-response";

export async function GET(request: Request) {
  try {
    return await fetch(apiUrl("/rating/"), {
      method: "GET",
      headers: request.headers,
    });
  } catch (e: any) {
    if (e instanceof Error) {
      console.error(`Route handler threw: ${e}`);
    }
  }

  return Response.json(serverErrorResponseModel, { status: 500 });
}
