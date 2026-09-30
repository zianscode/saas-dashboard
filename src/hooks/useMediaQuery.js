import { useSyncExternalStore } from "react";

export default function useMediaQuery(query) {
  const subscribe = (onStoreChange) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", onStoreChange);

    return () => mediaQuery.removeEventListener("change", onStoreChange);
  };

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
