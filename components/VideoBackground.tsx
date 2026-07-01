"use client";

import { useEffect, useState } from "react";

export default function VideoBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [play, setPlay] = useState(false);

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

  if (isMobile && !play) {
    return (
      <div className="absolute inset-0 w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('/video-poster.jpg')` }}>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <button
            onClick={() => setPlay(true)}
            className="p-4 rounded-full bg-white/90 text-deep-blue shadow-lg flex items-center justify-center"
            aria-label="Play background video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-play">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster="/video-poster.jpg"
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/background-video.mp4" type="video/mp4" />
    </video>
  );
}
