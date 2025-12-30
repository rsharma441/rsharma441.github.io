// src/sections/SongsSection.tsx
import React from "react";
import { Song } from "../types.d";

const SongsSection: React.FC<{ songs: Song[] }> = ({ songs }) => {
  return (
    <div className="songs-block">

<div className="songs-intro">
  Listen to this{" "}
  <a
    href="https://open.spotify.com/playlist/5ysHQMthqChqcx3ieV1Tp8?si=86c68003d6b44cb9"
    target="_blank"
    rel="noopener noreferrer"
  >
    this DJ mix
  </a>{" "}
  of my top 50 Songs of 2025! Enjoy!
</div>


      
  


    </div>
  );
};

export default SongsSection;
