"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoBackground() {
    const [isMobile, setIsMobile] = useState(false);
    const [play, setPlay] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const check = () => {
            const m = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches;
            setIsMobile(Boolean(m));
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        if (!isMobile) return;
        // Try to programmatically play the video on mobile (muted + playsInline required)
        const tryPlay = async () => {
            const v = videoRef.current;
            if (!v) return;
            try {
                await v.play();
                setPlay(true);
            } catch (err) {
                // autoplay blocked — keep poster until user interaction
                setPlay(false);
            }
        };
        tryPlay();
    }, [isMobile]);

    return (
        <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/video-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            onPlaying={() => setPlay(true)}
            onPause={() => setPlay(false)}
        >
            <source src="/background-video.mp4" type="video/mp4" />
        </video>
    );
}
