import { getToken } from "@/util/storage/token";

const noTokenResponseModel: ErrorResponseModel = {
  detail: "No token was supplied."
};

export default async function fetchWithToken(
  input: RequestInfo | URL,
  requestData?: RequestInit
) {
  const token = getToken();

  if (!token) {
    return Response.json(noTokenResponseModel, { status: 400 });
  }

  return await fetch(input, {
    headers: { ...requestData?.headers, Authorization: token },
    ...requestData
  });
}
