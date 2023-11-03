export function withLocalStorage(fn: (storage: Storage) => any) {
  try {
    return fn(localStorage);
  } catch (e) {}
  // TODO: maybe yield and retry?

  return null;
}

export function getStorageItem(key: string) {
  return withLocalStorage((localStorage) => localStorage.getItem(key));
}

export function setStorageItem(key: string, value: string) {
  return withLocalStorage((localStorage) => localStorage.setItem(key, value));
}
