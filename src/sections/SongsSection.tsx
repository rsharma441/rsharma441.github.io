// src/sections/SongsSection.tsx
import React from "react";
import { Song } from "../types.d";

const SongsSection: React.FC<{ songs: Song[] }> = ({ songs }) => {
  return (
    <div className="songs-block">

        <div className="songs-content">
            <p className="songs-intro">
            To see my favorite tracks of 2025, check out this DJ mix of all of them 
    
            
            </p>

                    <a href="https://open.spotify.com/playlist/5ysHQMthqChqcx3ieV1Tp8?si=86c68003d6b44cb9" target="_blank" rel="noopener noreferrer">
                here
            </a>.
            <br />
            <br />
            <p>
                If you don't have Spotify, and actually want them, tell me hah. 
            </p>


        </div>
    </div>
  );
};

export default SongsSection;
