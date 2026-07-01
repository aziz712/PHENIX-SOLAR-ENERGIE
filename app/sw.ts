import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { CacheExpiration, CacheFirst, NetworkFirst, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Exclude media files (videos, audio) - serve directly without caching
    {
      matcher: /\.(mp4|webm|ogg|mp3|wav)$/i,
      handler: new NetworkFirst({
        cacheName: "media",
        networkTimeoutSeconds: 5,
      }),
    },
    // Use default cache for everything else
    ...defaultCache,
  ],
});

serwist.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    serwist.skipWaiting();
  }
});

serwist.addEventListeners();

// Error handling for fetch events
self.addEventListener("fetch", (event) => {
  // Prevent unhandled promise rejections
  if (event.request.destination === "video" || event.request.destination === "audio") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response("Media unavailable", { status: 503 });
      })
    );
  }
});
