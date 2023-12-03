import { apiUrl } from "@/util/api/api-url";
import serverErrorResponseModel from "@/util/api/error-response";

export async function POST(request: Request) {
  try {
    return await fetch(apiUrl("/rating/"), {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(await request.json())
    });
  } catch (e: any) {
    if (e instanceof Error) {
      console.error(`Route handler threw: ${e}`);
    }
  }

  return Response.json(serverErrorResponseModel, { status: 500 });
}
