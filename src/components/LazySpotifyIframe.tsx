import React, { useState, useRef, useEffect } from "react";

const LazySpotifyIframe: React.FC<{ spotifyId: string, 
type: "album" | "track" }> = ({ spotifyId, type }) => {
  const [isVisible, setIsVisible] = useState(false);
  const iframeRef = useRef<HTMLDivElement | null>(null);
  let url = "";



    if(type === "album") {
        url = `https://open.spotify.com/embed/album/${spotifyId}`;
    }
    else {
        url = `https://open.spotify.com/embed/track/${spotifyId}`;
    }                                   


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      if (iframeRef.current) {
        observer.unobserve(iframeRef.current);
      }
    };
  }, []);

  return (
    <div ref={iframeRef} style={{ minHeight: "80px" }}>
      {isVisible && (
        <iframe
          src={url}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        ></iframe>
      )}
    </div>
  );
};

export default LazySpotifyIframe;
