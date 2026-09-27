import { useState, useEffect, useCallback } from "react";

/**
 * Lightweight hash-based router using the browser History API.
 * Enables Chrome back/forward arrows to navigate between app views.
 *
 * Usage:
 *   const { path, navigate, onPopState } = useHashRouter(defaultPath);
 *
 * - `path`     — current hash path, e.g. "/login"
 * - `navigate` — push a new entry:  navigate("/dashboard")
 * - `replace`  — replace current entry without adding history
 */
export default function useHashRouter(defaultPath = "/") {
  function readHash() {
    const h = window.location.hash.replace(/^#/, "");
    return h || defaultPath;
  }

  const [path, setPath] = useState(readHash);

  // Listen to popstate (back/forward)
  useEffect(() => {
    function onPop() {
      setPath(readHash());
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Initialize hash if empty
  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, "", `#${defaultPath}`);
    }
  }, [defaultPath]);

  const navigate = useCallback((newPath) => {
    if (newPath !== readHash()) {
      window.history.pushState(null, "", `#${newPath}`);
      setPath(newPath);
    }
  }, []);

  const replace = useCallback((newPath) => {
    window.history.replaceState(null, "", `#${newPath}`);
    setPath(newPath);
  }, []);

  return { path, navigate, replace };
}
