// src/sections/SongsSection.tsx
import React from "react";
import { Song } from "../types.d";

const SongsSection: React.FC<{ songs: Song[] }> = ({ songs }) => {
  return (
    <div className="songs-block">
        <div className="songs-spine">TRACKS</div>

        <div className="songs-content">
            <p className="songs-intro">
            A running playlist of these songs lives{" "}
            <a href="https://open.spotify.com/playlist/5ysHQMthqChqcx3ieV1Tp8?si=86c68003d6b44cb9" target="_blank" rel="noopener noreferrer">
                here
            </a>.
            </p>

            <ul className="songs-list">
            {songs.map((song, i) => (
                <li key={i} className="song-item">
                    <span className="song-index">{i + 1}</span>

                <span className="song-title">{song.title}</span>
                <span className="song-sep">—</span>
                <span className="song-artist">{song.artist}</span>
                </li>
            ))}
            </ul>

        </div>
    </div>
  );
};

export default SongsSection;
