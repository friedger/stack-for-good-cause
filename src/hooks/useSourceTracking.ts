import { useEffect, useState } from "react";

const SOURCE_STORAGE_KEY = "stackingSource";

export const useSourceTracking = () => {
  const [currentSource, setCurrentSource] = useState<string>("");

  useEffect(() => {
    // Get source from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlSource =
      urlParams.get("utm_source") ||
      urlParams.get("source") ||
      urlParams.get("referral") ||
      "";

    if (urlSource) {
      // Store new source in localStorage
      localStorage.setItem(SOURCE_STORAGE_KEY, urlSource);
      setCurrentSource(urlSource);
    } else {
      // Try to get source from localStorage if no URL param
      const storedSource = localStorage.getItem(SOURCE_STORAGE_KEY) || "";
      setCurrentSource(storedSource);
    }
  }, []);

  const clearSource = () => {
    localStorage.removeItem(SOURCE_STORAGE_KEY);
    setCurrentSource("");
  };

  const getStoredSource = (): string => {
    return localStorage.getItem(SOURCE_STORAGE_KEY) || "";
  };

  return {
    currentSource,
    clearSource,
    getStoredSource,
  };
};
