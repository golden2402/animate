const baseUrl = "http://server";

export function apiUrl(path: string) {
  return `${baseUrl}${path}`;
}
