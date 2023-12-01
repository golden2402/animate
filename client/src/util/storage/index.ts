export function withLocalStorage(fn: (storage: Storage) => any) {
  try {
    return fn(localStorage);
  } catch (e) {}
  // TODO: maybe yield and retry?

  return null;
}

export function getStorageItem(key: string): string | null {
  return withLocalStorage((localStorage) => localStorage.getItem(key));
}

export function setStorageItem(key: string, value: string): string | null {
  return withLocalStorage((localStorage) => localStorage.setItem(key, value));
}
