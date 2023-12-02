import { apiUrl } from "@/util/api/api-url";
import serverErrorResponseModel from "@/util/api/error-response";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return await fetch(apiUrl(`/anime`));
  } catch (e: any) {
    if (e instanceof Error) {
      console.error(`Route handler threw: ${e}`);
    }
  }

  return Response.json(serverErrorResponseModel, { status: 500 });
}