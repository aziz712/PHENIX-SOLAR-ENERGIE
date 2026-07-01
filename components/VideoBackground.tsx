"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoBackground() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const video = videoRef.current;
        if (!video) return;

        // Function to attempt autoplay
        const attemptAutoplay = async () => {
            try {
                // Important: video must be muted for autoplay in modern browsers
                video.muted = true;
                const playPromise = video.play();

                if (playPromise !== undefined) {
                    await playPromise;
                    setIsPlaying(true);
                }
            } catch (error) {
                console.log("Autoplay failed:", error);
                setIsPlaying(false);
            }
        };

        // Attempt autoplay when video metadata is loaded
        if (video.readyState >= 1) {
            // Metadata already loaded
            attemptAutoplay();
        } else {
            // Wait for metadata to load
            video.addEventListener("loadedmetadata", attemptAutoplay, { once: true });
        }

        // Cleanup
        return () => {
            video.removeEventListener("loadedmetadata", attemptAutoplay);
        };
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
            onPlaying={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={() => {
                // Ensure video is set to muted for autoplay
                if (videoRef.current) {
                    videoRef.current.muted = true;
                }
            }}
        >
            <source src="/background-video.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
        </video>
    );
}
