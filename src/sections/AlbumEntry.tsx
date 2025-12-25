// src/sections/AlbumEntry.tsx
import React from "react";
import { Album } from "../types.d";

const AlbumEntry: React.FC<{ album: Album; index: number, recommendation?: string }> = ({ album, index, recommendation }) => {

    const rank = 25 - index ;

  return (
    <article className={`album-poster ${index % 2 === 1 ? "staggered" : ""}`}>
      {/* LEFT VERTICAL SPINE */}
      <div className="poster-meta">
        <span className="poster-rank">{rank}</span>
        <span className="poster-label">{album.artist}</span>
      </div>

      <div className="poster-body">
        {/* BIG BACKGROUND WORD */}
        <div className="poster-bg-word">{album.artist}</div>

        {/* IMAGE */}
        <a
          href={album.linkToListen}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={album.albumCover}
            alt={album.albumName}
            className="poster-cover"
          />
        </a>


        {/* TEXT CONTENT */}
        <div className="poster-content">
          <h3 className="poster-title">{album.albumName}</h3>
          <p className="poster-artist">{album.genre}</p>

          <div className="poster-line" />

          <p className="poster-review">{album.review}</p>

          <div className="poster-reco">
            <span className="poster-reco-label">GREAT IF YOU LIKE</span>
            <span className="poster-reco-text">{album.greatIfYouLike}</span>
            <br />
            {recommendation && (
            <div className="poster-recommendation">
              <span className="poster-reco-label">AI PERSONALIZED RECOMMENDATIONS</span>
              <p className="poster-reco-reason">{recommendation}</p>
            </div>
          )}
          </div>



        </div>

        <div className="poster-shape" />
      </div>

    </article>
  );
};

export default AlbumEntry;
