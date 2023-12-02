import { getStorageItem, setStorageItem } from "@/util/storage";

const tokenIdentifier = "_animate_access_token";

export function setToken(value: string | null) {
  return setStorageItem(tokenIdentifier, value);
}

export function getToken() {
  return getStorageItem(tokenIdentifier);
}
