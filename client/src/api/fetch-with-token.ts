import getToken from "@/util/storage/token";

export default async function fetchWithToken(
  input: RequestInfo | URL,
  requestData?: RequestInit
) {
  const token = getToken();

  if (!token) {
    // FIXME: spoofing--good for usage of "ok", bad for all other cases:
    return null;
  }

  return await fetch(input);
}
