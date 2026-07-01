"use client";

import { useEffect, useRef } from "react";

export default function VideoBackground() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hasAttemptedPlayRef = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const video = videoRef.current;
        if (!video || hasAttemptedPlayRef.current) return;

        // Ensure muted state (required for autoplay)
        video.muted = true;
        video.volume = 0;

        const attemptPlay = async () => {
            if (hasAttemptedPlayRef.current) return;
            hasAttemptedPlayRef.current = true;

            try {
                await video.play();
                console.log("[VideoBackground] ✅ Video playing");
            } catch (error) {
                console.warn("[VideoBackground] ⚠️ Autoplay blocked:", error);
                // Poster will show as fallback
            }
        };

        // Try to play once video is ready
        if (video.readyState >= 2) {
            // HAVE_CURRENT_DATA - enough data to play
            attemptPlay();
        } else {
            // Wait for canplay event (more reliable than loadedmetadata)
            const handleCanPlay = () => {
                console.log("[VideoBackground] Video is ready to play (canplay event)");
                attemptPlay();
            };

            video.addEventListener("canplay", handleCanPlay, { once: true });

            // Safety timeout in case events don't fire
            const timeoutId = setTimeout(() => {
                console.log("[VideoBackground] Timeout: attempting to play anyway");
                attemptPlay();
            }, 4000);

            return () => {
                clearTimeout(timeoutId);
                video.removeEventListener("canplay", handleCanPlay);
            };
        }
    }, []);

    return (
        <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="auto"
            poster="/video-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
                console.error("[VideoBackground] ❌ Video error:", e.currentTarget.error?.message);
            }}
        >
            <source src="/background-video.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
        </video>
    );
}
