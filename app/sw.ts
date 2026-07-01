import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { NetworkFirst } from "serwist";

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

serwist.addEventListeners();

// Enhanced error handling for fetch events
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        // If offline, serve the offline page
        const urlObj = new URL("/offline", self.location.origin);
        const cachedResponse = await caches.match(urlObj.toString());
        return cachedResponse || new Response("Offline", { status: 503 });
      })
    );
    return;
  }

  // Handle media requests (video/audio)
  if (request.destination === "video" || request.destination === "audio") {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response("Media unavailable", { status: 503 });
      })
    );
    return;
  }
});
