import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Album } from "../types.d";
import { motion, AnimatePresence } from "framer-motion";
import LazySpotifyIframe from "./LazySpotifyIframe";
import HonorableMentions from "./HonorableMentions"; // Import the new component

import "../styles.css";

interface AlbumListProps {
  albums: Album[];
  recommendations: { rank: number; reason: string }[];
}

const AlbumList: React.FC<AlbumListProps> = ({ albums, recommendations }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reversedAlbums = [...albums].reverse();
  const [selectedAlbum, setSelectedAlbum] = useState<Album>(reversedAlbums[0]); // Default to the first album
  const [recommendation, setRecommendation] = useState<string>("");
  const albumIndex = searchParams.get("album")

  

  
  useEffect(() => {
    // Extract the album index from the query parameter
    const albumIndex = parseInt(searchParams.get("album") || "0", 10);

    if (!isNaN(albumIndex) && albumIndex >= 0 && albumIndex < reversedAlbums.length) {
      setSelectedAlbum(reversedAlbums[albumIndex]);

      const matchingRecommendation = recommendations[24-albumIndex]?.reason || "No recommendation available.";
      setRecommendation(matchingRecommendation);

    } else {
      setSelectedAlbum(reversedAlbums[0]); // Fallback to the first album
      setRecommendation(recommendations[0]?.reason || "No recommendation available.");

    }
  }, [searchParams, reversedAlbums]);

  const handlePrev = () => {
    const currentIndex = reversedAlbums.indexOf(selectedAlbum);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;

    setSelectedAlbum(reversedAlbums[newIndex]);
    setSearchParams({ album: newIndex.toString() });
  };

  const handleNext = () => {
    const currentIndex = reversedAlbums.indexOf(selectedAlbum);
    const newIndex =
      currentIndex < reversedAlbums.length - 1 ? currentIndex + 1 : currentIndex;

    setSelectedAlbum(reversedAlbums[newIndex]);
    setSearchParams({ album: newIndex.toString() });
  };

  const spotifyId = useMemo(() => {
    const extractSpotifyId = (url: string): string | null => {
      const regex = /https:\/\/open\.spotify\.com\/album\/([a-zA-Z0-9]+)(?:\?si=)?/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    return selectedAlbum?.linkToListen
      ? extractSpotifyId(selectedAlbum.linkToListen)
      : null;
  }, [selectedAlbum]);
  
  if (!albumIndex) {
    console.log(albumIndex);
    return <HonorableMentions />;
  }

  return (
    <div className="album-container">
      <div className="album-details">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAlbum.rank}
            className="album-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="album-display"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Album Cover */}
              <motion.img
                src={selectedAlbum.albumCover}
                alt={selectedAlbum.albumName}
                className="album-cover"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              />

              {/* Navigation Buttons */}
              {/* Navigation Buttons */}
              <motion.div
                className="navigation-buttons"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {reversedAlbums.indexOf(selectedAlbum) > 0 && (
                  <button className="carousel-button" onClick={handlePrev}>
                    ❮ Prev
                  </button>
                )}
                {reversedAlbums.indexOf(selectedAlbum) <
                  reversedAlbums.length - 1 && (
                  <button className="carousel-button" onClick={handleNext}>
                    Next ❯
                  </button>
                )}
              </motion.div>
            </motion.div>

            {/* Album Details */}
            <div className="details">
              {/* Title and Artist */}
              <motion.h3
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                {selectedAlbum.rank}. {selectedAlbum.albumName} -{" "}
                {selectedAlbum.artist}
              </motion.h3>

              {/* Review Section */}
              <motion.div
                className="review-container"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className={`review ${selectedAlbum.rank === "1" ? "special-font" : ""}`}>
                  <span className="highlight">({selectedAlbum.genre})</span> 
                  {selectedAlbum.review.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>

                <p className="great-if-you-like">
                  <strong className="highlight">Great if you like:</strong> 
                  {recommendation}
                </p>
              </motion.div>


              {/* Spotify Embed */}
              {spotifyId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <LazySpotifyIframe spotifyId={spotifyId} type="album" />
                </motion.div>
              )}

              {/* Full Album Button */}
              <motion.a
                href={selectedAlbum.linkToListen}
                target="_blank"
                rel="noopener noreferrer"
                className="listen-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                🎧 Full Album
              </motion.a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlbumList;
