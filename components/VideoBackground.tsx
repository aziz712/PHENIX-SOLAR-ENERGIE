"use client";

import { useEffect, useRef } from "react";

export default function VideoBackground() {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const video = videoRef.current;
        if (!video) return;

        // Ensure video is muted (required for autoplay)
        video.muted = true;
        video.volume = 0;

        const playVideo = async () => {
            try {
                await video.play();
                console.log("Video playing successfully");
            } catch (error) {
                console.error("Video play error:", error);
                // Retry after a delay if failed
                setTimeout(() => {
                    video.play().catch((err) => console.error("Retry failed:", err));
                }, 2000);
            }
        };

        // Use canplay event - fires when enough data is buffered to play
        const handleCanPlay = () => {
            console.log("Video can play, attempting autoplay...");
            playVideo();
        };

        // Fallback: try to play when metadata loads
        const handleLoadedMetadata = () => {
            console.log("Metadata loaded");
            if (!video.paused) return; // Already playing
            playVideo();
        };

        // Listen to events
        video.addEventListener("canplay", handleCanPlay, { once: true });
        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        // Additional fallback with timeout
        const fallbackTimeout = setTimeout(() => {
            console.log("Timeout fallback - attempting to play");
            playVideo();
        }, 3000);

        return () => {
            clearTimeout(fallbackTimeout);
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, []);

    return (
        <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="metadata"
            poster="/video-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
                console.error("Video element error:", e.currentTarget.error);
            }}
        >
            <source src="/background-video.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
        </video>
    );
}
