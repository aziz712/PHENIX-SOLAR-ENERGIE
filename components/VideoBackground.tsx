"use client";

import { useEffect, useRef } from "react";

export default function VideoBackground() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playAttemptedRef = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const video = videoRef.current;
        if (!video) return;

        // FORCE muted state (CRITICAL - must be set immediately)
        video.muted = true;
        video.volume = 0;

        const tryPlay = async () => {
            if (playAttemptedRef.current) return;
            playAttemptedRef.current = true;

            try {
                // Attempt play
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    await playPromise;
                    console.log("[VideoBackground] ✅ Playing");
                }
            } catch (err: any) {
                console.warn("[VideoBackground] Play blocked:", err?.name);
            }
        };

        // STRATEGY 1: Try immediately (before any events)
        Promise.resolve().then(() => {
            console.log("[VideoBackground] Initial play attempt");
            tryPlay();
        });

        // STRATEGY 2: On loadstart (earliest video event)
        const handleLoadStart = () => {
            console.log("[VideoBackground] loadstart fired");
            tryPlay();
        };

        // STRATEGY 3: On canplay (enough buffered to play)
        const handleCanPlay = () => {
            console.log("[VideoBackground] canplay fired");
            tryPlay();
        };

        // STRATEGY 4: On loadeddata (actual data available)
        const handleLoadedData = () => {
            console.log("[VideoBackground] loadeddata fired");
            tryPlay();
        };

        video.addEventListener("loadstart", handleLoadStart, { once: true });
        video.addEventListener("canplay", handleCanPlay, { once: true });
        video.addEventListener("loadeddata", handleLoadedData, { once: true });

        // STRATEGY 5: Fallback timeout
        const fallbackTimer = setTimeout(() => {
            console.log("[VideoBackground] Fallback timeout triggered");
            tryPlay();
        }, 1500);

        return () => {
            clearTimeout(fallbackTimer);
            video.removeEventListener("loadstart", handleLoadStart);
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("loadeddata", handleLoadedData);
        };
    }, []);

    return (
        <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            poster="/video-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            onLoadStart={() => console.log("[VideoBackground] Load started")}
            onLoadedMetadata={() => console.log("[VideoBackground] Metadata loaded")}
            onCanPlay={() => console.log("[VideoBackground] Can play")}
            onPlaying={() => console.log("[VideoBackground] Now playing")}
            onError={(e) => {
                const video = e.currentTarget;
                const error = video.error;

                // Detailed error logging for debugging
                console.error('[VideoBackground] Video error details:', {
                    code: error?.code,
                    message: error?.message,
                    codeName:
                        error?.code === 1 ? 'MEDIA_ERR_ABORTED' :
                            error?.code === 2 ? 'MEDIA_ERR_NETWORK' :
                                error?.code === 3 ? 'MEDIA_ERR_DECODE' :
                                    error?.code === 4 ? 'MEDIA_ERR_SRC_NOT_SUPPORTED' :
                                        'UNKNOWN',
                    networkState: video.networkState,
                    networkStateName:
                        video.networkState === 0 ? 'NETWORK_EMPTY' :
                            video.networkState === 1 ? 'NETWORK_IDLE' :
                                video.networkState === 2 ? 'NETWORK_LOADING' :
                                    video.networkState === 3 ? 'NETWORK_NO_SOURCE' :
                                        'UNKNOWN',
                    readyState: video.readyState,
                    readyStateName:
                        video.readyState === 0 ? 'HAVE_NOTHING' :
                            video.readyState === 1 ? 'HAVE_METADATA' :
                                video.readyState === 2 ? 'HAVE_CURRENT_DATA' :
                                    video.readyState === 3 ? 'HAVE_FUTURE_DATA' :
                                        video.readyState === 4 ? 'HAVE_ENOUGH_DATA' :
                                            'UNKNOWN',
                    currentSrc: video.currentSrc,
                    duration: video.duration,
                    buffered: video.buffered.length > 0 ? `${video.buffered.end(0).toFixed(2)}s` : 'none',
                });

                // If network error, try to reload the source
                if (error?.code === 4) { // MEDIA_ERR_SRC_NOT_SUPPORTED
                    console.warn("[VideoBackground] Attempting to reload video source");
                    video.src = "/background-video.mp4?" + Date.now(); // Cache bust
                    video.load();
                }
            }}
        >
            <source src="/background-video.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
        </video>
    );
}
