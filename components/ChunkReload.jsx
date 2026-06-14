"use client";

import { useEffect } from "react";

/**
 * Auto-recovers from stale-chunk failures.
 *
 * A ChunkLoadError happens when the browser holds an old chunk manifest (after
 * a rebuild/redeploy) and tries to lazy-load a chunk hash that no longer exists.
 * Instead of showing the error, we reload once to fetch the fresh manifest.
 * A 10s guard prevents any reload loop.
 */
export default function ChunkReload() {
  useEffect(() => {
    const KEY = "__chunk_reload_at";
    const isChunkError = (msg) =>
      typeof msg === "string" &&
      /Loading chunk [^ ]+ failed|ChunkLoadError|Loading CSS chunk [^ ]+ failed|importing a module script failed/i.test(
        msg
      );

    const maybeReload = (msg) => {
      if (!isChunkError(msg)) return;
      const last = Number(sessionStorage.getItem(KEY)) || 0;
      if (Date.now() - last < 10000) return; // already reloaded recently — avoid a loop
      sessionStorage.setItem(KEY, String(Date.now()));
      window.location.reload();
    };

    const onError = (e) => maybeReload(e?.message || e?.error?.message);
    const onRejection = (e) =>
      maybeReload(e?.reason?.message || String(e?.reason || ""));

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
