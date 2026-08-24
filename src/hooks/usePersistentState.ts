"use client";

import { useCallback, useSyncExternalStore } from "react";
import { loadJson, saveJson } from "@/lib/storage";

const CHANGE_EVENT = "whats-left-storage";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function usePersistentState<T>(key: string, initial: T) {
  const getSnapshot = () => {
    const stored = loadJson<T>(key);
    return JSON.stringify(stored ?? initial);
  };
  const getServerSnapshot = () => JSON.stringify(initial);
  const json = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = JSON.parse(json) as T;

  const setValue = useCallback(
    (next: T) => {
      saveJson(key, next);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key],
  );

  return [value, setValue] as const;
}
