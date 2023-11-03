import { getStorageItem } from "@/util/storage";

const tokenIdentifier = "_animate_access_token";

export default function getToken() {
  return getStorageItem(tokenIdentifier);
}
