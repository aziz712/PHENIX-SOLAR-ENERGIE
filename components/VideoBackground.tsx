"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoBackground() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const autoplayAttemptedRef = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const video = videoRef.current;
        if (!video || autoplayAttemptedRef.current) return;

        // Function to attempt autoplay
        const attemptAutoplay = async () => {
            if (autoplayAttemptedRef.current) return;
            autoplayAttemptedRef.current = true;

            try {
                video.muted = true;
                await video.play();
                setIsPlaying(true);
            } catch (error) {
                console.error("Video autoplay failed:", error);
                setIsPlaying(false);
            }
        };

        // Try multiple approaches for better reliability
        const canPlayHandler = () => {
            attemptAutoplay();
        };

        const loadedDataHandler = () => {
            attemptAutoplay();
        };

        // Check if video can already play
        if (video.readyState >= 2) {
            // HAVE_CURRENT_DATA or more - video data is loaded
            attemptAutoplay();
        } else {
            // Listen to multiple events for better coverage
            video.addEventListener("canplay", canPlayHandler, { once: true });
            video.addEventListener("loadeddata", loadedDataHandler, { once: true });

            // Fallback: try after a short delay
            const timeoutId = setTimeout(() => {
                attemptAutoplay();
            }, 1500);

            return () => {
                clearTimeout(timeoutId);
                video.removeEventListener("canplay", canPlayHandler);
                video.removeEventListener("loadeddata", loadedDataHandler);
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
            crossOrigin="anonymous"
            poster="/video-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            onPlaying={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={(e) => {
                console.error("Video error:", e.currentTarget.error);
            }}
        >
            <source src="/background-video.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
        </video>
    );
}
