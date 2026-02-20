import { useEffect, useState } from "react";

export interface UsePageLoadedOptions {
  minDuration?: number;
  onLoaded?: () => void;
}

export function usePageLoaded(options: UsePageLoadedOptions = {}) {
  const { minDuration = 1000, onLoaded } = options;
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const applyLoaded = () => {
      timeoutId = setTimeout(() => {
        setIsPageLoaded(true);
        onLoaded?.();
        timeoutId = null;
      }, minDuration);
    };

    if (document.readyState === "complete") {
      applyLoaded();
    } else {
      const handler = () => applyLoaded();
      window.addEventListener("load", handler);
      return () => {
        window.removeEventListener("load", handler);
        if (timeoutId !== null) clearTimeout(timeoutId);
      };
    }

    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [minDuration, onLoaded]);

  return isPageLoaded;
}
