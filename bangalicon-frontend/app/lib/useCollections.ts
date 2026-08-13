import { useCallback, useEffect, useState } from "react";

const SAVED_ICONS_KEY = "saved-icons";
const COLLECTIONS_EVENT = "bangalicon-collections-changed";

const normalizeSavedList = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((item) => String(item || "").trim())
        .filter(Boolean)
      )
  );
};

const readSavedIcons = () => {
  try {
    const raw = window.localStorage.getItem(SAVED_ICONS_KEY);
    return raw ? normalizeSavedList(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
};

const dispatchCollectionsChanged = (names: string[]) => {
  window.dispatchEvent(
    new CustomEvent(COLLECTIONS_EVENT, {
      detail: normalizeSavedList(names),
    })
  );
};

export function useCollections() {
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const commitSaved = useCallback((value: string[]) => {
    const nextSaved = normalizeSavedList(value);
    setSaved(nextSaved);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(SAVED_ICONS_KEY, JSON.stringify(nextSaved));
      dispatchCollectionsChanged(nextSaved);
    }
  }, []);

  useEffect(() => {
    setSaved(readSavedIcons());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== SAVED_ICONS_KEY) {
        return;
      }

      setSaved(readSavedIcons());
    };

    const handleCollectionsChanged = (event: Event) => {
      const detail = (event as CustomEvent<string[]>).detail;
      if (Array.isArray(detail)) {
        setSaved(normalizeSavedList(detail));
        return;
      }

      setSaved(readSavedIcons());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(COLLECTIONS_EVENT, handleCollectionsChanged as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(COLLECTIONS_EVENT, handleCollectionsChanged as EventListener);
    };
  }, [ready]);

  const toggleSave = useCallback((name: string) => {
    setSaved((prev) => {
      const nextSaved = prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name];

      if (typeof window !== "undefined") {
        const normalized = normalizeSavedList(nextSaved);
        window.localStorage.setItem(SAVED_ICONS_KEY, JSON.stringify(normalized));
        dispatchCollectionsChanged(normalized);
        return normalized;
      }

      return normalizeSavedList(nextSaved);
    });
  }, []);

  const replaceSaved = useCallback((names: string[]) => {
    commitSaved(names);
  }, [commitSaved]);

  const clearAll = useCallback(() => {
    commitSaved([]);
  }, [commitSaved]);

  return {
    saved,
    ready,
    toggleSave,
    replaceSaved,
    clearAll,
  };
}
